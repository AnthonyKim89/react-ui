import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './StressApp.css'

class StressApp extends Component {

  render() {
    return (
      <div className="c-tnd-stress">
        {this.props.data && this.props.data.get(SUBSCRIPTIONS[0]) ?
          <Chart
            xField="measured_depth"
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                type='line'
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
    return Object.keys(SUPPORTED_CHART_SERIES)
      .map(s => this.getDataSeries(s));
  }

  getDataSeries(field) {
    return {
      renderType: 'line',
      title: field,
      field,
      data: this.props.data.getIn([SUBSCRIPTIONS[0], 'data', 'points'])
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

StressApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default StressApp;
