import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import ObjectGraph from '../../../common/ObjectGraph';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MSEVDepthApp.css'

class MSEVDepthApp extends Component {

  constructor(props) {
    super(props);
    this.toUnit = props.convert.GetUserUnitPreference('length');
  }

  render() {
    return (
      <div className="c-de-mse-v-depth">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <ObjectGraph series={this.getSeries()} inverted={true} xAxisLabelFormatter={this.formatYLabel()} /> :
          <LoadingIndicator />}
      </div>
    );
  }

  formatYLabel() {
    let toUnit = this.toUnit;
    return (
      function() {
        return '<span class="c-de-mse-v-depth-x-label">' + this.value + '</span>' + toUnit;
      }
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
  }

  getDataSeries(field) {
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', field]);
    let subtype = SUPPORTED_CHART_SERIES[field].subType;
    let processedData = [];
    rawData.valueSeq().forEach((value) => {
      processedData.push([
        value.get("measured_depth"),
        value.get(subtype)
      ])
    });

    return {
      name: SUPPORTED_CHART_SERIES[field].label,
      data: this.props.convert.ConvertArray(processedData, 0, 'length', 'ft', this.toUnit),
      color: this.getSeriesColor(field),
      animation: false
    };
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

}

MSEVDepthApp.propTypes = {
  graphColors: ImmutablePropTypes.map,
};

export default MSEVDepthApp;
