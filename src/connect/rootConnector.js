// @flow

import React, { PureComponent } from 'react';
import RNShakeEvent from 'react-native-shake-event';
import { captureScreen } from 'react-native-view-shot';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';

export default function rootConnector(Component: ReactClass<*>): ReactClass<*> {
  class RootConnector extends PureComponent {

    componentWillMount() {
      RNShakeEvent.addEventListener('shake', this.onShakeEventListener);
    }

    componentWillUnmount() {
      RNShakeEvent.removeEventListener('shake');
    }

    onShakeEventListener = () => {
      this.takeSnapShot()
        .then(image => {
          this.props.navigator.handleDeepLink({ link: { name: 'ShakeEvent', data: image } });
        });
    }

    takeSnapShot = () => {
      return new Promise(resolve => {
        this.setState({ maskVisible: false }, () => {
          setTimeout(() => resolve(captureScreen({
            format: 'jpg',
            quality: 0.8,
            result: 'data-uri',
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT
          })), 300);
        });
      });
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  }

  RootConnector.displayName = `RootConnector(${Component.name})`;

  return RootConnector;
}
