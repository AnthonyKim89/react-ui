import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './MSEHeatmapApp.css'

class MSEHeatmapApp extends Component {

  render() {
    return (
      <div className="c-de-mseheatmap">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Heatmap title="MSE Heatmap" dataNode={"rotary"} data={subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS)} /> :
          <LoadingIndicator />}
      </div>
    );
  }
}

MSEHeatmapApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default MSEHeatmapApp;
