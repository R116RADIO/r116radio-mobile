// @flow

import React, { PureComponent } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import { SplashScene, DashboardScene } from 'AppScenes';

import createStore from './src/redux/store/store';
const store = createStore();

const RouterWithRedux = connect()(Router);

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux showNavigationBar={false}>
          <Scene key="root" hideNavBar={true}>
            <Scene key="splash" component={SplashScene} initial={true} />
            <Scene key="dashboard" component={DashboardScene} />
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}
