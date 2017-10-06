// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { CachedImage as RNImage, promisify } from 'AppUtilities';
import { HKGroteskBold, HKGroteskRegular } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY, WHITE } from 'AppColors';
import * as Progress from 'react-native-progress';
import { get, isEmpty } from 'lodash';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  thumbView: {
    width: WINDOW_WIDTH * 0.33 + 3,
    height: WINDOW_WIDTH * 0.33 + 3,
  },
  thumb: {
    width: WINDOW_WIDTH * 0.33,
    height: WINDOW_WIDTH * 0.33,
    borderWidth: 1.5,
    borderColor: WHITE
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30
  },
  playButton: {
    width: 70,
    height: 70,
    resizeMode: 'contain'
  },
  detailContainer: {
    justifyContent: 'space-between',
    marginLeft: 15
  },
  title: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 16,
      }
    }),
    color: WHITE
  },
  artist: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 14,
      }
    }),
    color: WHITE
  },
  playlistTitle: {
    fontSize: 14,
    color: GRAY
  }
});

class PlayerForm extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      song: props.dataSource
    };

    this.fetchListener = null;

    // start syncing artist info
    this.startFetching(props.channel);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel !== this.props.channel) {
      this.startFetching(nextProps.channel);
    }

    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({ song: nextProps.dataSource });
    }
  }

  componentWillUnmount() {
    if (this.fetchListener) {
      clearTimeout(this.fetchListener);
      this.fetchListener = null;
    }
  }

  /**
   * Function to start syncing for new channel
   * @param channel
   */
  startFetching = (channel) => {
    if (isEmpty(channel)) {
      return;
    }

    if (this.fetchListener) {
      clearInterval(this.fetchListener);
      this.fetchListener = null;
    }

    this.fetchListener = setInterval(() => {
      this.fetchChannelInfo(channel);
    }, 15000);
  };

  /**
   * Function to sync artist info
   * @param channel
   */
  fetchChannelInfo = (channel) => {
    const { fetchAudios } = this.props;

    promisify(fetchAudios, { url: channel })
      .then((data) => this.setState({ song: data }));
  };

  render() {
    const {
      isPlaying,
      onPlayButtonClicked,
      isPortrait,
      screenWidth,
      screenHeight
    } = this.props;

    const { song } = this.state;

    const rWidth = isPortrait ? screenWidth : screenHeight;

    const thumbUri = get(song, 'track.imageurl');
    const thumbImage = isEmpty(thumbUri)
      ? require('img/images/placeholder.png')
      : { uri: thumbUri };

    const title = get(song, 'track.title');
    const artist = get(song, 'track.artist');
    const playlistTitle = get(song, 'track.playlist.title');

    const playButtonImage = isPlaying
      ? require('img/buttons/btn_stop.png')
      : require('img/buttons/btn_play.png');

    const isTablet = DeviceInfo.isTablet();

    const titleFontSize = isTablet
      ? 40
      : Platform.OS === 'ios'
        ? 18
        : 15;

    const artistFontSize = isTablet
      ? 36
      : Platform.OS === 'ios'
        ? 16
        : 13;

    const playlistFontSize = isTablet
      ? 34
      : 13;

    return (
      <View style={[styles.container, { flexDirection: isPortrait ? 'column' : 'row' }]}>
        <View style={[styles.thumbView, { width: rWidth * 0.33 + 3, height: rWidth * 0.33 + 3 }]}>
          <RNImage
            style={[styles.thumb, { width: rWidth * 0.33, height: rWidth * 0.33 }]}
            resizeMode={'contain'}
            indicator={Progress.Circle}
            indicatorProps={{
              size: 30,
              thickness: 3,
              borderWidth: 3,
              color: GRAY
            }}
            source={thumbImage}
            threshold={50}
          />
        </View>
        <View style={[styles.infoContainer,
          { marginTop: isPortrait ? rWidth * 0.05 : 0, marginLeft: isPortrait ? 0 : 30 }
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPlayButtonClicked}
          >
            <Image
              style={[styles.playButton, { width: rWidth * 0.18, height: rWidth * 0.18 }]}
              source={playButtonImage}
            />
          </TouchableOpacity>
          <View
            style={[styles.detailContainer,
              { height: rWidth * 0.18 - rWidth * 0.01, marginLeft: rWidth * 0.02 }]}
          >
            <HKGroteskBold
              numberOfLines={1}
              style={[styles.title, { fontSize: titleFontSize }]}
            >
              {isEmpty(title) ? 'Unknown' : title}
            </HKGroteskBold>
            <HKGroteskRegular
              numberOfLines={1}
              style={[styles.artist, { fontSize: artistFontSize }]}
            >
              {isEmpty(artist) ? 'Unknown' : artist}
            </HKGroteskRegular>
            <HKGroteskRegular
              numberOfLines={1}
              style={[styles.playlistTitle, { fontSize: playlistFontSize }]}
            >
              {isEmpty(playlistTitle) ? 'Unknown' : playlistTitle}
            </HKGroteskRegular>
          </View>
        </View>
      </View>
    );
  }
}

PlayerForm.propTypes = {
  dataSource: PropTypes.object,
  onPlayButtonClicked: PropTypes.func.isRequired,
  isPortrait: PropTypes.bool,
  screenWidth: PropTypes.number.isRequired,
  screenHeight: PropTypes.number.isRequired,
  channel: PropTypes.string.isRequired,
  fetchAudios: PropTypes.func.isRequired,
};

PlayerForm.defaultProps = {
  dataSource: {},
  isPortrait: true
};

export default PlayerForm;
