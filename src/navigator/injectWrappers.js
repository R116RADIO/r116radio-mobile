// @flow

import React from 'react';

import { Provider } from 'AppRedux';
import { overrideLogs } from 'AppUtilities';
import { rootConnector, FirebaseWrapper } from 'AppConnectors';
import { firebaseConfig } from 'AppConfig';

import mapNavigatorToProps from './mapNavigationToProps';

if (!__DEV__) {
  overrideLogs();
}

export default function (Component: React.Element<*>): Function {
  return function navigationConnector(): Function {
    return function inject(props: Object): React.Element<*> {
      const AppLevelEnhanced = rootConnector(Component);

      return (
        <Provider>
          <FirebaseWrapper config={firebaseConfig}>
            <AppLevelEnhanced
              {...props}
              {...mapNavigatorToProps(props.navigator)}
            />
          </FirebaseWrapper>
        </Provider>
      );
    };
  };
}
