import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './TorqueApp.css'

class TorqueApp extends Component {

  render() {
    return (
      <div className="c-tnd-torque">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            xField="measured_depth"
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                dashStyle='Solid'
                lineWidth={2}
                key={field}
                id={field}
                title={SUPPORTED_CHART_SERIES[field].label}
                data={data}
                yField={field}
                color={this.getSeriesColor(field)} />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getSeries() {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'points']);
    data = this.props.convert.ConvertImmutables(data, "measured_depth", "length", 'ft');
    // Converting y-axis values to their target unit.
    for (let property in SUPPORTED_CHART_SERIES) {
      if (SUPPORTED_CHART_SERIES.hasOwnProperty(property) && SUPPORTED_CHART_SERIES[property].hasOwnProperty("unitType")) {
        data = this.props.convert.ConvertImmutables(data, property, SUPPORTED_CHART_SERIES[property].unitType, SUPPORTED_CHART_SERIES[property].unit);
      }
    }
    return Object.keys(SUPPORTED_CHART_SERIES).map(s => this.getDataSeries(s, data));
  }

  getDataSeries(field, data) {
    return {
      renderType: 'line',
      title: field,
      field,
      data: data
    };
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    } else {
      return SUPPORTED_CHART_SERIES[field].defaultColor;
    }
  }

}

TorqueApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default TorqueApp;
