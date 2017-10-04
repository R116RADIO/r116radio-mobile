// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { CachedImage as RNImage } from 'AppUtilities';
import { HKGroteskBold, HKGroteskRegular } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { GRAY, WHITE } from 'AppColors';
import * as Progress from 'react-native-progress';
import { get, isEmpty } from 'lodash';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent'
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
    width: WINDOW_WIDTH * 0.17,
    height: WINDOW_WIDTH * 0.17,
    resizeMode: 'contain'
  },
  detailContainer: {
    justifyContent: 'space-between',
    marginLeft: 15,
    height: WINDOW_WIDTH * 0.17 - 5
  },
  title: {
    width: WINDOW_WIDTH * 0.3,
    fontSize: 18,
    color: WHITE
  },
  artist: {
    width: WINDOW_WIDTH * 0.3,
    fontSize: 16,
    color: WHITE
  },
  playlistTitle: {
    width: WINDOW_WIDTH * 0.3,
    fontSize: 14,
    color: GRAY
  }
});

class PlayerForm extends PureComponent {

  render() {
    const {
      dataSource: song,
      isPlaying,
      onPlayButtonClicked
    } = this.props;

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

    return (
      <View style={styles.container}>
        <RNImage
          style={styles.thumb}
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
        <View style={styles.infoContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPlayButtonClicked}
          >
            <Image
              style={styles.playButton}
              source={playButtonImage}
            />
          </TouchableOpacity>
          <View style={styles.detailContainer}>
            <HKGroteskBold numberOfLines={1} style={styles.title}>
              {isEmpty(title) ? 'Unknown' : title}
            </HKGroteskBold>
            <HKGroteskRegular numberOfLines={1} style={styles.artist}>
              {isEmpty(artist) ? 'Unknown' : artist}
            </HKGroteskRegular>
            <HKGroteskRegular numberOfLines={1} style={styles.playlistTitle}>
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
  onPlayButtonClicked: PropTypes.func.isRequired
};

PlayerForm.defaultProps = {
  dataSource: {}
};

export default PlayerForm;
