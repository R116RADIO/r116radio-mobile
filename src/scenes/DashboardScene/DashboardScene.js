// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  NetInfo,
  Dimensions,
  AppState
} from 'react-native';

import { connectAudios } from 'AppRedux';
import { BLACK } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { PlayerForm, PlaylistTabView } from 'AppComponents';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { get, isEqual, isEmpty } from 'lodash';
import { AlertMessage, promisify } from 'AppUtilities';
import Orientation from 'react-native-orientation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BLACK
  },
  logo: {
    width: WINDOW_WIDTH * 0.27,
    marginTop: 50,
    resizeMode: 'contain'
  }
});

class DashboardScene extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      selectedMusicSource: '',
      selectedMusic: props.audios,
      isPortrait: true,
      screenWidth: WINDOW_WIDTH,
      screenHeight: WINDOW_HEIGHT
    };
  }

  componentDidMount() {
    // listen orientation change
    Orientation.addOrientationListener(this.orientationChangeListener);

    // listen app state
    AppState.addEventListener('change', this.appStateChangeListener);

    this.checkProps(this.props);
  }

  componentWillMount() {
    this.orientationChangeListener(Orientation.getInitialOrientation());
  }

  componentWillUnmount() {
    // stop audio when app is closed
    ReactNativeAudioStreaming.stop();

    // remove listeners
    NetInfo.isConnected.removeEventListener(
      'change',
      this.connectionStatusChangeListener
    );
    AppState.removeEventListener(
      'change',
      this.appStateChangeListener
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.audios, nextProps.audios)) {
      this.setState({ selectedMusic: nextProps.audios });
      this.checkProps(nextProps);
    }
  }

  appStateChangeListener = (state) => {
    if (state === 'background' || state === 'inactive') {
      return;
    }

    if (state !== 'active') {
      return;
    }

    // if app goes into active state
    // check if music was playing
    // if true, continue playing, false nothing to do
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        if (this.state.isPlaying) {
          ReactNativeAudioStreaming.resume();
        }
      }
    });
  };

  orientationChangeListener = (orientation) => {
    if (orientation === 'PORTRAIT') {
      this.setState({ isPortrait: true });
    } else {
      this.setState({ isPortrait: false });
    }
  };

  onStreamLineChanged = (streamUrl) => {
    const { fetchAudios } = this.props;

    this.setState({ isPlaying: false });
    ReactNativeAudioStreaming.stop();

    promisify(fetchAudios, { url: streamUrl })
      .catch((e) => AlertMessage.showMessage(e));
  };

  onPlayButtonClicked = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      ReactNativeAudioStreaming.pause();
    } else {
      ReactNativeAudioStreaming.resume();
    }

    this.setState({ isPlaying: !isPlaying });
  };

  checkProps = (props) => {
    const { audios } = props;
    const selectedMusicSource = get(audios, 'tuneinurl');

    if (!isEmpty(selectedMusicSource)) {
      this.setState({ isPlaying: true, selectedMusicSource: `${selectedMusicSource}.mp3` }, () => {
        ReactNativeAudioStreaming.play(this.state.selectedMusicSource,
          { showIniOSMediaCenter: true, showInAndroidNotifications: true });
      });
    }
  };

  onChangeMainLayout = (event) => {
    this.setState({
      screenHeight: event.nativeEvent.layout.height,
      screenWidth: event.nativeEvent.layout.width,
    });
  };

  render() {
    const { isPlaying, selectedMusic, isPortrait, screenWidth, screenHeight } = this.state;

    const { width, height } = Dimensions.get('window');
    const rWidth = isPortrait ? width : height;

    return (
      <View style={styles.container} onLayout={this.onChangeMainLayout}>
        <Image
          style={[styles.logo, { width: rWidth * 0.27, marginTop: isPortrait ? 50 : 10 }]}
          source={require('img/images/logo.png')}
        />
        <PlayerForm
          dataSource={selectedMusic}
          isPlaying={isPlaying}
          onPlayButtonClicked={this.onPlayButtonClicked}
          isPortrait={isPortrait}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
        <PlaylistTabView
          onStreamLineChanged={this.onStreamLineChanged}
          screenWidth={screenWidth}
        />
      </View>
    );
  }
}

DashboardScene.propTypes = {
  audios: PropTypes.object.isRequired,
  fetchAudios: PropTypes.func.isRequired
};

export default connectAudios()(DashboardScene);
