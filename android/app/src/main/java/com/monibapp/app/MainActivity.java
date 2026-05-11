package com.monibapp.app;

import com.getcapacitor.BridgeActivity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        // Start foreground service to keep process alive while in background
        Intent serviceIntent = new Intent(this, AudioService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Stop foreground service when app is back in foreground
        stopService(new Intent(this, AudioService.class));

        // Re-resume the WebView in case it was paused — keeps audio/JS running
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
            getBridge().getWebView().resumeTimers();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Undo WebView pause so audio continues in background
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().onResume();
            getBridge().getWebView().resumeTimers();
        }
    }
}
