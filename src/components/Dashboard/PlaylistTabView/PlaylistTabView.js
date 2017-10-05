// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';

import { HKGroteskSemiBold, HKGroteskRegular } from 'AppFonts';
import { WINDOW_WIDTH } from 'AppConstants';
import { WHITE, DARK_RED, DARKER_RED } from 'AppColors';
import { channels } from 'AppConfig';

const TAB_ITEM_WIDTH = WINDOW_WIDTH / channels.length;

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 18,
    color: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  contentView: {
    width: WINDOW_WIDTH,
    flexDirection: 'row'
  },
  tabItem: {
    width: TAB_ITEM_WIDTH,
    height: 50,
    backgroundColor: DARK_RED,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemTitle: {
    ...Platform.select({
      ios: {
        fontSize: 18,
      },
      android: {
        fontSize: 14,
      }
    }),
    color: WHITE
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    width: TAB_ITEM_WIDTH,
    height: 3,
    backgroundColor: WHITE,
  }
});

class PlaylistTabView extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      currentChannel: channels[0].url,
      sliderPosition: new Animated.Value(0)
    };
  }

  changeStreamLine = (channel, index) => {
    const { currentChannel } = this.state;
    const { onStreamLineChanged, screenWidth } = this.props;

    if (channel === currentChannel) {
      return;
    }

    this.setState({ currentChannel: channel });

    const newPosition = index * (screenWidth / 3);

    Animated.timing(
      this.state.sliderPosition, {
        toValue: newPosition,
        duration: 100
      }
    ).start(() => {
      onStreamLineChanged(channel);
    });
  };

  render() {
    const { currentChannel, sliderPosition } = this.state;
    const { screenWidth } = this.props;

    return (
      <View style={[styles.container, { width: screenWidth }]}>
        <HKGroteskRegular style={styles.title}>
          Choose your genre:
        </HKGroteskRegular>
        <View style={[styles.contentView, { width: screenWidth }]}>
          {channels.map((channel, index) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => this.changeStreamLine(channel.url, index)}
                style={[styles.tabItem,
                  { width: screenWidth / channels.length,
                    backgroundColor: currentChannel === channel.url ? DARKER_RED : DARK_RED }]
                }
              >
                <HKGroteskSemiBold style={styles.tabItemTitle}>
                  {channel.title}
                </HKGroteskSemiBold>
              </TouchableOpacity>
            );
          })}
        </View>
        <Animated.View
          style={[styles.slider,
            { width: screenWidth / channels.length, left: sliderPosition }
            ]}
        />
      </View>
    );
  }
}

PlaylistTabView.propTypes = {
  onStreamLineChanged: PropTypes.func.isRequired,
  screenWidth: PropTypes.number.isRequired
};

export default PlaylistTabView;
