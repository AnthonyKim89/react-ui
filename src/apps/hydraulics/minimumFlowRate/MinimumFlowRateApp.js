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
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
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
            xAxisTitle={{text: `Measured Depth (${this.props.convert.getUnitDisplay('length')})`}}
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}>
            <ChartSeries
              key={title}
              id={title}
              type="line"
              title={title}
              data={this.getSeriesData()}
              yField="value"
              yAxisTitle={{text: `Flow Rate (${this.props.convert.getUnitDisplay('volume')}pm)`}}
              color={this.getSeriesColor('flow_rate')}
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
    let points = this.getData().getIn(['data', 'flow_rate']);
    points = this.props.convert.convertImmutables(points, 'measured_depth', 'length', 'ft');
    points = this.props.convert.convertImmutables(points, 'value', 'volume', 'gal');
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
  coordinates: PropTypes.object.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default MinimumFlowRateApp;
