package com.monibapp.app;

import com.getcapacitor.BridgeActivity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebView;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

/**
 * Edge-to-edge with CSS safe-area vars for WebView (status bar + navigation bar).
 * AudioService lifecycle hooks are preserved for background playback.
 */
public class MainActivity extends BridgeActivity {
    private static final int INSET_PUSH_INTERVAL_MS = 200;
    private static final int INSET_PUSH_BURST_COUNT = 30;

    private boolean decorInsetsListenerAttached = false;
    private int lastTopPx = -1;
    private int lastBottomPx = -1;
    private int lastLeftPx = -1;
    private int lastRightPx = -1;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private int insetBurstRemaining = 0;
    private final Runnable insetBurstRunnable = new Runnable() {
        @Override
        public void run() {
            applyInsetsToWebViewIfPossible();
            if (insetBurstRemaining-- > 0) {
                mainHandler.postDelayed(this, INSET_PUSH_INTERVAL_MS);
            }
        }
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(Color.TRANSPARENT);
            getWindow().setNavigationBarColor(0xE8FFFFFF);
        }
        attachDecorInsetsListener();
        startInsetPushBurst();
    }

    @Override
    public void onStart() {
        super.onStart();
        startInsetPushBurst();
    }

    @Override
    public void onStop() {
        super.onStop();
        mainHandler.removeCallbacks(insetBurstRunnable);
        Intent serviceIntent = new Intent(this, AudioService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        startInsetPushBurst();
        stopService(new Intent(this, AudioService.class));

        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
            getBridge().getWebView().resumeTimers();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
            getBridge().getWebView().resumeTimers();
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            View decor = getWindow().getDecorView();
            if (decor != null) {
                ViewCompat.requestApplyInsets(decor);
            }
            startInsetPushBurst();
        }
    }

    private void attachDecorInsetsListener() {
        if (decorInsetsListenerAttached) {
            return;
        }
        final View decor = getWindow().getDecorView();
        if (decor == null) {
            return;
        }
        decorInsetsListenerAttached = true;

        ViewCompat.setOnApplyWindowInsetsListener(decor, (v, insets) -> {
            applyInsetsFromWindow(insets);
            return insets;
        });

        decor.post(() -> ViewCompat.requestApplyInsets(decor));
    }

    private void startInsetPushBurst() {
        mainHandler.removeCallbacks(insetBurstRunnable);
        insetBurstRemaining = INSET_PUSH_BURST_COUNT;
        mainHandler.post(insetBurstRunnable);
    }

    private void applyInsetsToWebViewIfPossible() {
        View decor = getWindow().getDecorView();
        if (decor == null) {
            return;
        }
        WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(decor);
        if (insets != null) {
            applyInsetsFromWindow(insets);
        }
    }

    private int resolveTopInsetPx(WindowInsetsCompat insets) {
        Insets status = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        Insets sys = insets.getInsets(WindowInsetsCompat.Type.systemBars());
        Insets cutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout());

        int top = Math.max(Math.max(status.top, sys.top), cutout.top);
        if (top <= 0) {
            top = getStatusBarHeightFallbackPx();
        }
        return top;
    }

    private int resolveBottomInsetPx(WindowInsetsCompat insets) {
        Insets nav = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
        Insets sys = insets.getInsets(WindowInsetsCompat.Type.systemBars());
        Insets cutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
        Insets tappable = insets.getInsets(WindowInsetsCompat.Type.tappableElement());

        int bottom = Math.max(
            Math.max(Math.max(nav.bottom, sys.bottom), cutout.bottom),
            tappable.bottom);

        if (bottom <= 0) {
            bottom = getNavigationBarHeightFallbackPx();
        }
        return bottom;
    }

    private int getStatusBarHeightFallbackPx() {
        int resId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resId > 0) {
            return getResources().getDimensionPixelSize(resId);
        }
        return Math.round(28f * getResources().getDisplayMetrics().density);
    }

    private int getNavigationBarHeightFallbackPx() {
        int resId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (resId > 0) {
            return getResources().getDimensionPixelSize(resId);
        }
        return Math.round(48f * getResources().getDisplayMetrics().density);
    }

    private void applyInsetsFromWindow(WindowInsetsCompat insets) {
        final int left = Math.max(
            insets.getInsets(WindowInsetsCompat.Type.systemBars()).left,
            insets.getInsets(WindowInsetsCompat.Type.displayCutout()).left);
        final int top = resolveTopInsetPx(insets);
        final int right = Math.max(
            insets.getInsets(WindowInsetsCompat.Type.systemBars()).right,
            insets.getInsets(WindowInsetsCompat.Type.displayCutout()).right);
        final int bottom = resolveBottomInsetPx(insets);

        if (top == lastTopPx && bottom == lastBottomPx && left == lastLeftPx && right == lastRightPx) {
            return;
        }
        lastTopPx = top;
        lastBottomPx = bottom;
        lastLeftPx = left;
        lastRightPx = right;

        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView == null) {
            return;
        }

        pushInsetsToCss(webView, left, top, right, bottom);
    }

    private void pushInsetsToCss(WebView webView, int left, int top, int right, int bottom) {
        final String js =
            "(function(){"
                + "var s=document.documentElement.style,r=document.documentElement;"
                + "s.setProperty('--native-safe-top','" + top + "px');"
                + "s.setProperty('--native-safe-bottom','" + bottom + "px');"
                + "s.setProperty('--native-safe-left','" + left + "px');"
                + "s.setProperty('--native-safe-right','" + right + "px');"
                + "r.classList.add('capacitor-android');"
                + "if(typeof window.__syncAppSafeAreas==='function')window.__syncAppSafeAreas();"
                + "else if(typeof window.__syncAppHeaderInsetTop==='function')window.__syncAppHeaderInsetTop();"
                + "})();";
        webView.post(() -> webView.evaluateJavascript(js, null));
    }
}
