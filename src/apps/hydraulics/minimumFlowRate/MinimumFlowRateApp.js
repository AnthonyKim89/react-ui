import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MinimumFlowRateApp.css';

class MinimumFlowRateApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors))
    );
  }

  render() {
    let title = SUPPORTED_CHART_SERIES['flow_rate'].label;
    return (
      <div className="c-hydraulics-minimum-flow-rate">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            xAxisWidth="1"
            xAxisColor="white"
            xAxisTitle={{
              text: `Measured Depth (${this.props.convert.getUnitDisplay('length')})`,
              style: {color: '#fff'}
            }}
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}>
            <ChartSeries
              key={title}
              id={title}
              type="area"
              fillOpacity={0.5}
              lineWidth={2.0}
              title={title}
              data={this.getSeriesData()}
              yField="recommended_minimum_flowrate"
              yAxisTitle={{
                text: `Flow Rate (${this.props.convert.getUnitDisplay('volume')}pm)`,
                style: {color: '#fff'}
              }}
              color={this.getSeriesColor('flow_rate')}
              step={true}
            />
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  getSeriesData() {
    let points = this.getData().getIn(['data', 'sections']);
    points = this.props.convert.convertImmutables(points, 'measured_depth', 'length', 'ft');
    points = this.props.convert.convertImmutables(points, 'recommended_minimum_flowrate', 'volume', 'gal');
    return points;
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

}

MinimumFlowRateApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object,
  widthCols: PropTypes.number.isRequired
};

export default MinimumFlowRateApp;
