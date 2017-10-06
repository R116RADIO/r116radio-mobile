// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  AppState,
} from 'react-native';

import { connectAudios } from 'AppRedux';
import { BLACK } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { PlayerForm, PlaylistTabView } from 'AppComponents';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { get, isEqual, isEmpty } from 'lodash';
import { AlertMessage, promisify } from 'AppUtilities';
import Orientation from 'react-native-orientation';
import { channels } from 'AppConfig';
import BackgroundTimer from 'react-native-background-timer';

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
      selectedChannel: channels[0].url,
      selectedMusicSource: '',
      selectedMusic: props.audios,
      isPortrait: true,
      screenWidth: WINDOW_WIDTH,
      screenHeight: WINDOW_HEIGHT,
      pausedFromOffline: false
    };

    this.backgroundTimer = null;
  }

  componentDidMount() {
    // listen orientation change
    Orientation.addOrientationListener(this.orientationChangeListener);

    // listen app state
    AppState.addEventListener('change', this.appStateChangeListener);

    this.checkProps(this.props);

    // background timer
    this.backgroundTimer = BackgroundTimer.setInterval(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      this.checkOnline();
    }, 2000);
  }

  checkOnline = () => {
    // const { isPlaying, pausedFromOffline, selectedMusicSource } = this.state;
    //
    // NetInfo.isConnected.fetch().then(isConnected => {
    //   if (!isConnected && isPlaying) {
    //     this.setState({ isPlaying: false, pausedFromOffline: true });
    //     ReactNativeAudioStreaming.stop();
    //   } else if (isConnected && pausedFromOffline) {
    //     this.setState({ isPlaying: true, pausedFromOffline: false });
    //     if (!isEmpty(selectedMusicSource)) {
    //       ReactNativeAudioStreaming.play(selectedMusicSource,
    //         { showIniOSMediaCenter: true, showInAndroidNotifications: true });
    //     }
    //   }
    // });
  };

  componentWillMount() {
    this.orientationChangeListener(Orientation.getInitialOrientation());
  }

  componentWillUnmount() {
    // stop audio when app is closed
    ReactNativeAudioStreaming.stop();

    AppState.removeEventListener(
      'change',
      this.appStateChangeListener
    );

    // Cancel the timer when you are done with it
    if (this.backgroundTimer) {
      BackgroundTimer.clearInterval(this.backgroundTimer);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldUrl = get(this.props.audios, 'tuneinurl');
    const newUrl = get(nextProps.audios, 'tuneinurl');

    if (!isEqual(oldUrl, newUrl)) {
      this.setState({ selectedMusic: nextProps.audios });
      this.checkProps(nextProps);
    }
  }

  appStateChangeListener = (state) => {
    console.log('state = ', state);
    if (state === 'background' || state === 'inactive') {
      return;
    }

    if (state !== 'active') {
      return;
    }

    // ReactNativeAudioStreaming.getStatus((error, result) => {
    //   console.log('error = ', error);
    //   if (!error) {
    //     console.log('result = ', result);
    //     if (result.status === 'ERROR' || result.status === 'PAUSED') {
    //       ReactNativeAudioStreaming.play(this.state.selectedMusicSource,
    //         { showIniOSMediaCenter: true, showInAndroidNotifications: true });
    //     }
    //   }
    // });
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

    // stop previous playing music
    this.setState({ isPlaying: false });
    ReactNativeAudioStreaming.stop();

    // fetch new music
    this.setState({ selectedChannel: streamUrl });

    promisify(fetchAudios, { url: streamUrl })
      .catch((e) => AlertMessage.showMessage(e));
  };

  onPlayButtonClicked = () => {
    const { isPlaying, selectedMusicSource } = this.state;

    if (isPlaying) {
      ReactNativeAudioStreaming.pause();
    } else {
      if (!isEmpty(selectedMusicSource)) {
        ReactNativeAudioStreaming.play(selectedMusicSource,
          { showIniOSMediaCenter: true, showInAndroidNotifications: true });
      }
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
    const { fetchAudios } = this.props;
    const {
      isPlaying,
      selectedMusic,
      isPortrait,
      screenWidth,
      screenHeight,
      selectedChannel
    } = this.state;

    const rWidth = isPortrait ? screenWidth : screenHeight;

    return (
      <View style={styles.container} onLayout={this.onChangeMainLayout}>
        <Image
          style={[styles.logo,
            { width: rWidth * 0.27, height: rWidth * 0.2, marginTop: isPortrait ? 50 : 10 }
            ]}
          source={require('img/images/logo.png')}
        />
        <PlayerForm
          dataSource={selectedMusic}
          isPlaying={isPlaying}
          onPlayButtonClicked={this.onPlayButtonClicked}
          isPortrait={isPortrait}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          channel={selectedChannel}
          fetchAudios={fetchAudios}
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
