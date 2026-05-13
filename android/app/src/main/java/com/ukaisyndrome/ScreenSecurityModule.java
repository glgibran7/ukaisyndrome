package com.ukaisyndrome;

import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ScreenSecurityModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ScreenSecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ScreenSecurity";
    }

    @ReactMethod
    public void enableSecure() {
        android.app.Activity activity = reactContext.getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() ->
                activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
            );
        }
    }

    @ReactMethod
    public void disableSecure() {
        android.app.Activity activity = reactContext.getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() ->
                activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
            );
        }
    }
}