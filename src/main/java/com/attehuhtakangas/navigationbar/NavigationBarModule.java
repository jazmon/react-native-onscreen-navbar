package com.attehuhtakangas.navigationbar;

import android.app.Activity;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class NavigationBarModule extends ReactContextBaseJavaModule {

    private static final String DEFAULT_COLOR = "#000000";
    private static String mCurrentColor = DEFAULT_COLOR;
    private static boolean mTranslucent = false;
    private Activity mActivity;

    public NavigationBarModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.mActivity = activity;
    }

    @Override
    public String getName() {
        return "NavigationBar";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DEFAULT_COLOR, Color.BLACK);
        return constants;
    }

    // TODO: create color parser class, currently this only accepts colors in full hex format eg. "#BADA55"
    // React Native understands rgb, rgba, "#fff", etc.
    @ReactMethod
    public void setColor(String color) {
        final int colorInt = Color.parseColor(color);
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mCurrentColor = color;
        }

        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    mActivity.getWindow().setNavigationBarColor(colorInt);
                }
            }
        });
    }

    @ReactMethod
    public void setTranslucent(final boolean val) {
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    if (val) {
                        mActivity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION, WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
                        mTranslucent = true;
                    } else {
                        mActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
                        mTranslucent = false;
                    }
                }
            }
        });
    }

    @ReactMethod
    public int getHeight() {
        // Resources resources = getReactApplicationContext().getResources();
        Resources resources = mActivity.getResources();
        int orientationInt = resources.getConfiguration().orientation;
        /* if (orientation.equalsIgnoreCase("portrait")) {
            orientationInt = Configuration.ORIENTATION_PORTRAIT;
        } else if(orientation.equalsIgnoreCase("landscape")) {
            orientationInt = Configuration.ORIENTATION_PORTRAIT;
        } else {
            return 0;
        }*/

        int id = resources.getIdentifier(orientationInt == Configuration.ORIENTATION_PORTRAIT ? "navigation_bar_height" : "navigation_bar_height_landscape", "dimen", "android");

        if (id > 0) {
            // int pixelSize = resources.getDimensionPixelSize(id);
            int dp = (int) (resources.getDimension(id) / resources.getDisplayMetrics().density);
            return dp;
        } else {
            return 0;
        }


    }

    @ReactMethod
    public String getCurrentColor() {
        return this.mCurrentColor;
    }

    @ReactMethod
    public boolean isTranslucent() {
        return this.mTranslucent;
    }

    @ReactMethod
    public void resetToDefault() {
        this.setTranslucent(false);
        this.setColor(DEFAULT_COLOR);
    }
}
