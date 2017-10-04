package com.r116radio;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.WindowManager;
import android.content.Intent;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.audioStreaming.ReactNativeAudioStreamingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  @Override
    public boolean isDebug() {
      return BuildConfig.DEBUG;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
      return Arrays.<ReactPackage>asList(
          new RNFetchBlobPackage(),
          new LinearGradientPackage(),
          new RNDeviceInfo(),
          new ReactNativeAudioStreamingPackage()
      );
    }

    @Override
    public void onCreate() {
      super.onCreate();

      SoLoader.init(this, /* native exopackage */ false);

      final NavigationApplication sharedInstance = this;

      setActivityCallbacks(new ActivityCallbacks() {
        @Override
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
          super.onActivityCreated(activity, savedInstanceState);
          activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        }
      });
    }
}
