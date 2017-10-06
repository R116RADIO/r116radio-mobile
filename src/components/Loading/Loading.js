// @flow

import React from 'react';
import { ActivityIndicator } from 'react-native';

export function Loading(props) {
  return (
    <ActivityIndicator {...props} />
  );
}

Loading.propTypes = {
  ...ActivityIndicator.PropTypes
};

Loading.defaultProps = {
  size: 'large',
  animating: true
};
