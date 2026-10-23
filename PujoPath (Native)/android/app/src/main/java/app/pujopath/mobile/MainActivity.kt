package app.pujopath.mobile

import android.content.pm.ActivityInfo
import android.database.ContentObserver
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.OrientationEventListener
import android.view.Surface
import android.util.Log

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {

  private var orientationEventListener: OrientationEventListener? = null
  private var rotationSettingsObserver: ContentObserver? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme)
    super.onCreate(null)

    initOrientationHandling()
  }

  private fun isAutoRotateEnabled(): Boolean {
    return try {
      Settings.System.getInt(
        contentResolver,
        Settings.System.ACCELEROMETER_ROTATION,
        0
      ) == 1
    } catch (e: Exception) {
      false
    }
  }

  @Suppress("DEPRECATION")
  private fun getCurrentDisplayRotation(): Int {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      display?.rotation ?: Surface.ROTATION_0
    } else {
      windowManager.defaultDisplay.rotation
    }
  }

  private fun initOrientationHandling() {
    orientationEventListener = object : OrientationEventListener(this) {
      override fun onOrientationChanged(orientation: Int) {
        if (orientation == ORIENTATION_UNKNOWN) return
        if (!isAutoRotateEnabled()) return

        // Orientation angles:
        // - Upright portrait (320°..360° or 0°..40°): SCREEN_ORIENTATION_PORTRAIT
        // - Landscape (50°..130° or 230°..310°): SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        // - Upside-down portrait (140°..220°): Explicitly rejected (null -> no change)
        val targetOrientation = when {
          orientation in 320..359 || orientation in 0..40 -> {
            ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
          }
          orientation in 50..130 || orientation in 230..310 -> {
            ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
          }
          orientation in 140..220 -> {
            // Upside-down portrait (180°) is rejected. Maintain previous orientation.
            null
          }
          else -> null // Deadzones / hysteresis
        }

        Log.d("PujoPathOrientation", "onOrientationChanged: deg=$orientation, target=$targetOrientation, current=$requestedOrientation")

        if (targetOrientation != null && requestedOrientation != targetOrientation) {
          Log.i("PujoPathOrientation", "Switching orientation to $targetOrientation for angle $orientation")
          requestedOrientation = targetOrientation
        }
      }
    }

    syncOrientationPolicy()
  }

  private fun syncOrientationPolicy() {
    val autoRotate = isAutoRotateEnabled()
    Log.d("PujoPathOrientation", "syncOrientationPolicy: autoRotate=$autoRotate")
    if (autoRotate) {
      orientationEventListener?.enable()
      val currentRotation = getCurrentDisplayRotation()
      if (currentRotation == Surface.ROTATION_90 || currentRotation == Surface.ROTATION_270) {
        if (requestedOrientation != ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE) {
          requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        }
      } else {
        // Enforce upright portrait for ROTATION_0 or if inverted (ROTATION_180)
        if (requestedOrientation != ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
          requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }
      }
    } else {
      orientationEventListener?.disable()
      val userRotation = try {
        Settings.System.getInt(contentResolver, Settings.System.USER_ROTATION, Surface.ROTATION_0)
      } catch (e: Exception) {
        Surface.ROTATION_0
      }
      Log.d("PujoPathOrientation", "Auto-rotate disabled. userRotation=$userRotation")
      if (userRotation == Surface.ROTATION_90 || userRotation == Surface.ROTATION_270) {
        if (requestedOrientation != ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE) {
          requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        }
      } else {
        // Default to upright portrait, rejecting reverse-portrait
        if (requestedOrientation != ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
          requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }
      }
    }
  }

  private fun registerRotationObserver() {
    if (rotationSettingsObserver == null) {
      rotationSettingsObserver = object : ContentObserver(Handler(Looper.getMainLooper())) {
        override fun onChange(selfChange: Boolean) {
          super.onChange(selfChange)
          syncOrientationPolicy()
        }
      }
      try {
        contentResolver.registerContentObserver(
          Settings.System.getUriFor(Settings.System.ACCELEROMETER_ROTATION),
          false,
          rotationSettingsObserver!!
        )
        contentResolver.registerContentObserver(
          Settings.System.getUriFor(Settings.System.USER_ROTATION),
          false,
          rotationSettingsObserver!!
        )
      } catch (e: Exception) {
        // Fallback safely if restricted
      }
    }
  }

  private fun unregisterRotationObserver() {
    rotationSettingsObserver?.let {
      try {
        contentResolver.unregisterContentObserver(it)
      } catch (e: Exception) {
        // Ignored
      }
      rotationSettingsObserver = null
    }
  }

  override fun onResume() {
    super.onResume()
    registerRotationObserver()
    syncOrientationPolicy()
  }

  override fun onPause() {
    super.onPause()
    unregisterRotationObserver()
    orientationEventListener?.disable()
  }

  override fun onDestroy() {
    super.onDestroy()
    unregisterRotationObserver()
    orientationEventListener?.disable()
    orientationEventListener = null
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
