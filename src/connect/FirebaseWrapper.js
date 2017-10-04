// @flow

import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import FirebaseInflater from './FirebaseInflater';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});

export default class FirebaseWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  static childContextTypes = {
    firebaseDatabase: PropTypes.object,
    firebaseStorage: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    FirebaseInflater.initialize(props);

    const firebaseApp = FirebaseInflater.getInstance();
    this.firebaseStorage = firebaseApp.storage();
    this.firebaseDatabase = firebaseApp.database();
  }

  getChildContext() {
    return {
      firebaseDatabase: this.firebaseDatabase,
      firebaseStorage: this.firebaseStorage,
    };
  }

  render() {
    return (
      <View style={styles.flex}>
        {Children.only(this.props.children)}
      </View>
    );
  }
}
