// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Platform,
  Image
} from 'react-native';
import { Loading } from 'AppComponents';
import { connectAudios } from 'AppRedux';
import { promisify } from 'AppUtilities';
import { Actions } from 'react-native-router-flux';
import { channels } from 'AppConfig';
import { CachedImage } from 'AppUtilities';
import {WINDOW_WIDTH} from "../../constants/constants";

const styles = StyleSheet.create({
  progressView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: WINDOW_WIDTH * 0.8,
    resizeMode: 'contain'
  }
});

class SplashScene extends PureComponent {

  componentDidMount() {
    const { fetchAudios } = this.props;

    CachedImage.init()
      .then(() => promisify(fetchAudios, { url: channels[0].url }))
      .then(() => Actions.dashboard());
  }

  renderIOSSplash = () => {
    return (
      <View style={styles.progressView}>
        <Loading />
      </View>
    );
  };

  render() {
    if (Platform.OS === 'ios') {
      return this.renderIOSSplash();
    }

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('img/images/logo.png')}
        />
      </View>
    );
  }
}

SplashScene.propTypes = {
  fetchAudios: PropTypes.func.isRequired
};

export default connectAudios()(SplashScene);
