import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import ObjectGraph from '../../../common/ObjectGraph';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MSEVDepthApp.css'

class MSEVDepthApp extends Component {

  render() {
    return (
      <div className="c-de-mse-v-depth">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <ObjectGraph series={this.getSeries()} /> :
          <LoadingIndicator />}
      </div>
    );
  }

  getSeries() {
    let series = [];
    for (let prop in SUPPORTED_CHART_SERIES) {
      if (SUPPORTED_CHART_SERIES.hasOwnProperty(prop)) {
        series.push(this.getDataSeries(prop))
      }
    }
    return series;
    //return Object.keys(SUPPORTED_CHART_SERIES).map(s => this.getDataSeries(s));
  }

  getDataSeries(field) {
    // Data Prep
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', field]);
    let fieldColor = SUPPORTED_CHART_SERIES[field].defaultColor;
    let subtype = SUPPORTED_CHART_SERIES[field].subType;
    let processedData = [];
    for (let i = 0; i < rawData.count(); i++) {
      let dataPoint = {
        x: rawData.get(i).get("measured_depth"),
        y: rawData.get(i).get(subtype),
        name: "DataPoint",
        color: fieldColor
      };
      processedData.unshift(dataPoint);
    }

    return {
      //renderType: 'line',
      name: SUPPORTED_CHART_SERIES[field].label,
      data: Immutable.fromJS(processedData),
    };
  }

}

MSEVDepthApp.propTypes = {
  //data: ImmutablePropTypes.map.isRequired,
};

export default MSEVDepthApp;
