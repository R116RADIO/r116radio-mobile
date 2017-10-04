// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

import { promisify, AlertMessage } from 'AppUtilities';
import { HKGroteskBold } from 'AppFonts';
import { connectAudios } from 'AppRedux';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class DashboardContainer extends PureComponent {

  render() {
    return (
      <View style={styles.container}>
        <HKGroteskBold>
          Dashboard
        </HKGroteskBold>
      </View>
    );
  }
}

DashboardContainer.propTypes = {
  routeScene: PropTypes.func.isRequired,
  fetchAudios: PropTypes.func.isRequired
};

export default connectAudios()(DashboardContainer);
