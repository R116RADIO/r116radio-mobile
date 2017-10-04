// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View
} from 'react-native';
import { Loading } from 'AppComponents';
import { connectAudios } from 'AppRedux';
import { promisify } from 'AppUtilities';
import { startApp } from 'AppNavigator';
import { channels } from 'AppConfig';

const styles = StyleSheet.create({
  progressView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class SplashScene extends PureComponent {

  componentDidMount() {
    const { fetchAudios } = this.props;

    setTimeout(() => {
      promisify(fetchAudios, { url: channels[0].url })
        .then(() => startApp());
    }, 500);
  }

  render() {
    return (
      <View style={styles.progressView}>
        <Loading />
      </View>
    );
  }
}

SplashScene.propTypes = {
  fetchAudios: PropTypes.func.isRequired
};

export default connectAudios()(SplashScene);
