import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ROPHeatmapApp.css'

class ROPHeatmapApp extends Component {

  render() {
    return (
      <div className="c-de-ropheatmap">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <div>Data Loaded</div> :
          <LoadingIndicator />}
      </div>
    );
  }
}

ROPHeatmapApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default ROPHeatmapApp;
