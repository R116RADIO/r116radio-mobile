// @flow

import { startApp } from 'AppNavigator';
import { CachedImage } from 'AppUtilities';
import { setStatusBarHidden } from 'AppUtilities';

if (__DEV__) {
  require('react-devtools');
}

setStatusBarHidden(true);

CachedImage.init()
  .then(() => startApp());
