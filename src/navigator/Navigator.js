// @flow

import { Navigation } from 'react-native-navigation';
import { NativeModules } from 'react-native';
import {
  DASHBOARD_SCENE
} from './constants';

import registerScreens from './registerScreens';

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

registerScreens();

export function startApp() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: DASHBOARD_SCENE,
      navigatorStyle: {
        navBarHidden: true,
        statusBarHidden: false,
        statusBarTextColorScheme: 'light',
      }
    },
    appStyle: {
      orientation: 'portrait'
    },
    animationType: 'fade',
  });
}
