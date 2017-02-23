import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './AxialLoadApp.css'

class AxialLoadApp extends Component {

  render() {
    return (
      <div className="c-tnd-axial-load">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            xField="measured_depth"
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                dashStyle='Solid'
                lineWidth={1}
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
      data: subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'points'])
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

AxialLoadApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default AxialLoadApp;
