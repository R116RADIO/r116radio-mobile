import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { DARK_GRAY } from 'AppColors';

const styles = StyleSheet.create({
  text: {
    color: DARK_GRAY,
    fontSize: 12,
    fontFamily: 'HKGrotesk-SemiBold',
    bottom: 2,
  }
});

export function HKGroteskSemiBold({ style, ...props }) {
  return (
    <Text {...props} style={[styles.text, style]} />
  );
}

HKGroteskSemiBold.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  style: Text.propTypes.style,
  ...Text.propTypes,
};
