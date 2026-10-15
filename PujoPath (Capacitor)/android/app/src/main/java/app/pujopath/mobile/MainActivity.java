package app.pujopath.mobile;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Window window = getWindow();

        // Enable edge-to-edge layout consistently across all Android versions (Android 10 - 16+)
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Configure display cutout for notch and hole-punch devices (Android 9+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.getAttributes().layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }

        // Solid theme-matching status bar and navigation bar defaults
        final int darkBg = Color.parseColor("#14110E");
        final int darkNavBg = Color.parseColor("#181411");
        window.setStatusBarColor(darkBg);
        window.setNavigationBarColor(darkNavBg);
        window.getDecorView().setBackgroundColor(darkBg);

        // Disable artificial contrast scrims on Android 10+ (API 29+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // Configure system bar indicators: light text/icons (white) on dark backgrounds initially
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(false);
            insetsController.setAppearanceLightNavigationBars(false);
        }

        // Ensure the root content view matches the background
        final View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setBackgroundColor(darkBg);
        }

        // Set insets listener directly on the WebView so it cannot be overridden by other plugins
        final View webView = findViewById(com.getcapacitor.android.R.id.webview);
        if (webView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, windowInsets) -> {
                Insets statusInsets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                );
                Insets navInsets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.navigationBars()
                );

                ViewGroup.LayoutParams genericLp = v.getLayoutParams();
                if (genericLp instanceof ViewGroup.MarginLayoutParams) {
                    ViewGroup.MarginLayoutParams lp = (ViewGroup.MarginLayoutParams) genericLp;
                    if (lp.topMargin != statusInsets.top ||
                        lp.bottomMargin != navInsets.bottom ||
                        lp.leftMargin != statusInsets.left ||
                        lp.rightMargin != statusInsets.right) {
                        lp.topMargin = statusInsets.top;
                        lp.bottomMargin = navInsets.bottom;
                        lp.leftMargin = statusInsets.left;
                        lp.rightMargin = statusInsets.right;
                        v.setLayoutParams(lp);
                    }
                }
                return windowInsets;
            });
            ViewCompat.requestApplyInsets(webView);
        }

        // Register dynamic theme bridge so light/dark mode changes update the status bar seamlessly
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(darkBg);
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void setSystemBarTheme(boolean isDark) {
                    runOnUiThread(() -> {
                        int barColor = Color.parseColor(isDark ? "#14110E" : "#FCFAF7");
                        int navColor = Color.parseColor(isDark ? "#181411" : "#F7F3EE");
                        window.setStatusBarColor(barColor);
                        window.setNavigationBarColor(navColor);
                        window.getDecorView().setBackgroundColor(barColor);
                        if (contentView != null) {
                            contentView.setBackgroundColor(barColor);
                        }
                        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                        if (controller != null) {
                            controller.setAppearanceLightStatusBars(!isDark);
                            controller.setAppearanceLightNavigationBars(!isDark);
                        }
                    });
                }
            }, "AndroidThemeBridge");
        }
    }
}
