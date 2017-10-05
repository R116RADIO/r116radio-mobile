// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  NetInfo
} from 'react-native';

import { connectAudios } from 'AppRedux';
import { BLACK } from 'AppColors';
import { WINDOW_WIDTH } from 'AppConstants';
import { PlayerForm, PlaylistTabView } from 'AppComponents';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { get, isEqual, isEmpty } from 'lodash';
import { AlertMessage, promisify } from 'AppUtilities';

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

class DashboardContainer extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      selectedMusicSource: '',
      selectedMusic: props.audios
    };
  }

  componentDidMount() {
    this.checkProps(this.props);
  }

  componentWillMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this.connectionStatusChangeListener
    );
  }

  componentWillUnmount() {
    // stop audio when app is closed
    ReactNativeAudioStreaming.stop();

    NetInfo.isConnected.removeEventListener(
      'change',
      this.connectionStatusChangeListener
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.audios, nextProps.audios)) {
      this.setState({ selectedMusic: nextProps.audios });
      this.checkProps(nextProps);
    }
  }

  connectionStatusChangeListener = (isConnected) => {
    AlertMessage.showMessage(null, isConnected ? 'online' : 'offline');
    if (isConnected) {
      this.setState({ isPlaying: true });
      ReactNativeAudioStreaming.play(this.state.selectedMusicSource,
        { showIniOSMediaCenter: true, showInAndroidNotifications: true });
    } else {
      if (this.state.isPlaying) {
        this.setState({ isPlaying: false });
        ReactNativeAudioStreaming.pause();
      }
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

  render() {
    const { isPlaying, selectedMusic } = this.state;

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('img/images/logo.png')}
        />
        <PlayerForm
          dataSource={selectedMusic}
          isPlaying={isPlaying}
          onPlayButtonClicked={this.onPlayButtonClicked}
        />
        <PlaylistTabView
          onStreamLineChanged={this.onStreamLineChanged}
        />
      </View>
    );
  }
}

DashboardContainer.propTypes = {
  routeScene: PropTypes.func.isRequired,
  audios: PropTypes.object.isRequired,
  fetchAudios: PropTypes.func.isRequired
};

export default connectAudios()(DashboardContainer);
