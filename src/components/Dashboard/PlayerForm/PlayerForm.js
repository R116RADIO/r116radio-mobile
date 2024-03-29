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
import { Loading } from 'AppComponents';
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
    width: WINDOW_WIDTH * 0.7 + 3,
    height: WINDOW_WIDTH * 0.7 + 3,
  },
  thumb: {
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_WIDTH * 0.7,
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
  },
  loader: {
    position: 'absolute'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
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
      screenHeight,
      isFetching
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
      ? Platform.OS === 'ios' ? 40 : 30
      : Platform.OS === 'ios' ? 18 : 15;

    const artistFontSize = isTablet
      ? Platform.OS === 'ios' ? 36 : 24
      : Platform.OS === 'ios' ? 16 : 13;

    const playlistFontSize = isTablet
      ? Platform.OS === 'ios' ? 34 : 24
      : Platform.OS === 'ios' ? 13 : 12;

    const thumbViewSize = isTablet ? rWidth * 0.4 + 3 : rWidth * (isPortrait ? 0.8 : 0.33) + 3;
    const thumbSize = isTablet ? rWidth * 0.4 : rWidth * (isPortrait ? 0.8 : 0.33);

    return (
      <View style={[styles.container, { flexDirection: isPortrait ? 'column' : 'row' }]}>
        <View style={[styles.thumbView, { width: thumbViewSize, height: thumbViewSize }]}>
          <RNImage
            style={[styles.thumb, { width: thumbSize, height: thumbSize }]}
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
            style={styles.buttonContainer}
            activeOpacity={0.8}
            onPress={onPlayButtonClicked}
            disabled={isFetching}
          >
            <Image
              style={[styles.playButton, { width: rWidth * 0.18, height: rWidth * 0.18 }]}
              source={playButtonImage}
            />
            {isFetching &&
              <Loading
                style={styles.loader}
                size={'small'}
              />
            }
          </TouchableOpacity>
          <View
            style={[styles.detailContainer,
              { minHeight: rWidth * 0.18 - rWidth * 0.01, marginLeft: rWidth * 0.02 }]}
          >
            <HKGroteskBold
              style={[styles.title, { fontSize: titleFontSize, maxWidth: rWidth * 0.6 }]}
            >
              {isEmpty(title) ? 'Unknown' : title}
            </HKGroteskBold>
            <HKGroteskRegular
              style={[styles.artist, { fontSize: artistFontSize, maxWidth: rWidth * 0.6 }]}
            >
              {isEmpty(artist) ? 'Unknown' : artist}
            </HKGroteskRegular>
            <HKGroteskRegular
              style={[styles.playlistTitle, { fontSize: playlistFontSize, maxWidth: rWidth * 0.6 }]}
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
  isPlaying: PropTypes.bool,
  isFetching: PropTypes.bool
};

PlayerForm.defaultProps = {
  dataSource: {},
  isPortrait: true,
  isPlaying: false,
  isFetching: false
};

export default PlayerForm;
