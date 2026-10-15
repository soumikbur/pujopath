package app.pujopath.mobile;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
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

        // Solid theme-matching status bar and navigation bar defaults
        final int initialColor = Color.parseColor("#14110E");
        window.setStatusBarColor(initialColor);
        window.setNavigationBarColor(Color.parseColor("#181411"));
        window.getDecorView().setBackgroundColor(initialColor);

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

        // Ensure the content view / WebView begins below the status bar so page content
        // never scrolls underneath system indicators across all Android versions (including API 35+)
        final View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setBackgroundColor(initialColor);
            ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, windowInsets) -> {
                Insets insets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                );
                v.setPadding(insets.left, insets.top, insets.right, 0);
                return windowInsets;
            });
        }

        // Register dynamic theme bridge so light/dark mode changes update the status bar seamlessly
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(initialColor);
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void setSystemBarTheme(boolean isDark) {
                    runOnUiThread(() -> {
                        int barColor = Color.parseColor(isDark ? "#14110E" : "#FCFAF7");
                        window.setStatusBarColor(barColor);
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
