// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  BackHandler
} from 'react-native';

import { connectAudios } from 'AppRedux';
import { BLACK } from 'AppColors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'AppConstants';
import { PlayerForm, PlaylistTabView } from 'AppComponents';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { get, isEmpty } from 'lodash';
import { AlertMessage, promisify } from 'AppUtilities';
import Orientation from 'react-native-orientation';
import { channels } from 'AppConfig';

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
      isFetching: false
    };
  }

  componentDidMount() {
    // listen orientation change
    Orientation.addOrientationListener(this.orientationChangeListener);
    BackHandler.addEventListener('hardwareBackPress', this.backButtonListener);
  }

  componentWillMount() {
    this.orientationChangeListener(Orientation.getInitialOrientation());
    BackHandler.removeEventListener('hardwareBackPress', this.backButtonListener);
  }

  componentWillUnmount() {
    // stop audio when app is closed
    ReactNativeAudioStreaming.stop();
  }

  orientationChangeListener = (orientation) => {
    if (orientation === 'PORTRAIT') {
      this.setState({ isPortrait: true });
    } else {
      this.setState({ isPortrait: false });
    }
  };

  backButtonListener = () => {
    BackHandler.exitApp();
  };

  onStreamLineChanged = (streamUrl) => {
    // stop previous playing music
    this.setState({ isPlaying: false });
    ReactNativeAudioStreaming.stop();

    // fetch new music
    this.setState({ selectedChannel: streamUrl }, () => this.playMusic());
  };

  onPlayButtonClicked = () => {
    const { isPlaying } = this.state;

    if (isPlaying) {
      this.setState({ isPlaying: false });
      ReactNativeAudioStreaming.pause();
    } else {
      this.playMusic();
    }
  };

  playMusic = () => {
    const { selectedChannel } = this.state;
    const { fetchAudios } = this.props;

    this.setState({ isFetching: true });

    promisify(fetchAudios, { url: selectedChannel })
      .then((data) => {
        const selectedMusicSource = get(data, 'tuneinurl');

        if (!isEmpty(selectedMusicSource)) {
          this.setState({
            isPlaying: true,
            selectedMusicSource: `${selectedMusicSource}.mp3`
          }, () => {
            ReactNativeAudioStreaming.play(this.state.selectedMusicSource,
              { showIniOSMediaCenter: true, showInAndroidNotifications: true });
          });
        }
      })
      .catch(() => AlertMessage.showMessage(null, 'Cannot connect to server.'))
      .finally(() => this.setState({ isFetching: false }));
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
      selectedChannel,
      isFetching
    } = this.state;

    const rWidth = isPortrait ? screenWidth : screenHeight;

    return (
      <View style={styles.container} onLayout={this.onChangeMainLayout}>
        <Image
          style={[styles.logo,
            { width: rWidth * 0.27, height: rWidth * 0.2, marginTop: isPortrait ? 50 : 10 }
            ]}
          resizeMode={'contain'}
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
          isFetching={isFetching}
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
