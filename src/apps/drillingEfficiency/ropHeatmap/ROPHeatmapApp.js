import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './ROPHeatmapApp.css'

class ROPHeatmapApp extends Component {

  render() {
    return (
      <div className="c-de-ropheatmap">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Heatmap title="ROP Heatmap" dataNode={"rotary"} data={subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS)} /> :
          <LoadingIndicator />}
      </div>
    );
  }
}

ROPHeatmapApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default ROPHeatmapApp;
