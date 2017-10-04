// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DashboardContainer } from 'AppComponents';

class DashboardScene extends PureComponent {

  render() {
    const { routeScene } = this.props;

    return (
      <DashboardContainer
        routeScene={routeScene}
      />
    );
  }
}

DashboardScene.propTypes = {
  routeScene: PropTypes.func.isRequired
};

export default DashboardScene;
