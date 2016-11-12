package com.attehuhtakangas.navigationbar;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.support.annotation.Nullable;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.PixelUtil;

import java.util.HashMap;
import java.util.Map;

public class NavigationBarModule extends ReactContextBaseJavaModule {

    private static final String ERROR_NO_ACTIVITY = "E_NO_ACTIVITY";
    private static final String ERROR_NO_ACTIVITY_MESSAGE = "Tried to change the navigation bar while not attached to an Activity";

    private static final String HEIGHT_KEY = "HEIGHT";

    public NavigationBarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NavigationBarManager";
    }


    @Override
    public
    @Nullable
    Map<String, Object> getConstants() {
        final Context context = getReactApplicationContext();
        final int heightResId = context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        final float height = heightResId > 0 ?
                PixelUtil.toDIPFromPixel(context.getResources().getDimensionPixelSize(heightResId)) : 0;

        final Map<String, Object> constants = new HashMap<>();
        constants.put(HEIGHT_KEY, height);

        return constants;
    }

    @ReactMethod
    public void setColor(final int color, final boolean animated, final Promise res) {

        final Activity activity = getCurrentActivity();
        if (activity == null) {
            res.reject(ERROR_NO_ACTIVITY, ERROR_NO_ACTIVITY_MESSAGE);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            UiThreadUtil.runOnUiThread(new Runnable() {
                @TargetApi(Build.VERSION_CODES.LOLLIPOP)
                @Override
                public void run() {
                    if (animated) {
                        int curColor = activity.getWindow().getNavigationBarColor();
                        ValueAnimator colorAnimation = ValueAnimator.ofObject(
                                new ArgbEvaluator(), curColor, color
                        );
                        colorAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                            @Override
                            public void onAnimationUpdate(ValueAnimator animation) {
                                activity.getWindow().setNavigationBarColor((Integer) animation.getAnimatedValue());
                            }
                        });
                        colorAnimation
                                .setDuration(300)
                                .setStartDelay(0);
                        colorAnimation.start();
                    } else {
                        activity.getWindow().setStatusBarColor(color);
                    }
                    res.resolve(null);
                }
            });
        } else {
            res.resolve(null);
        }
    }

    @ReactMethod
    public void setTranslucent(final boolean translucent, final Promise res) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            res.reject(ERROR_NO_ACTIVITY, ERROR_NO_ACTIVITY_MESSAGE);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            UiThreadUtil.runOnUiThread(new Runnable() {
                @TargetApi(Build.VERSION_CODES.LOLLIPOP)
                @Override
                public void run() {
                    if (translucent) {
                        activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION, WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
                    } else {
                        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
                    }
                    res.resolve(null);
                }
            });
        }
    }

    @ReactMethod
    public float getHeight() {
        final Context context = getReactApplicationContext();
        int orientationInt = context.getResources().getConfiguration().orientation;
        final int heightResId = context.getResources().getIdentifier(orientationInt == Configuration.ORIENTATION_PORTRAIT ?
                "navigation_bar_height" : "navigation_bar_height_landscape", "dimen", "android");
        final float height = heightResId > 0 ?
                PixelUtil.toDIPFromPixel(context.getResources().getDimensionPixelSize(heightResId)) : 0;

        return height;
    }

    @ReactMethod
    public void setHidden(final boolean hidden, final Promise res) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            res.reject(ERROR_NO_ACTIVITY, ERROR_NO_ACTIVITY_MESSAGE);
            return;
        }
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        if (hidden) {
                            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                        } else {
                            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                            activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                        }

                        res.resolve(null);
                    }
                }
        );
    }
}
