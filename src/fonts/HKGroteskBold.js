import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: DARK_GRAY,
    fontSize: 12,
    fontFamily: 'HKGrotesk-Bold',
    bottom: 2,
  }
});

export function HKGroteskBold({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

HKGroteskBold.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
};
