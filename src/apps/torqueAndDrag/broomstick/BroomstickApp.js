import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './BroomstickApp.css';

class BroomstickApp extends Component {

  constructor(props) {
    super(props);
    this.state = {series: List()};
  }

  render() {
    return (
      <div className="c-tnd-broomstick">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            xAxisWidth="2"
            xAxisColor="white"
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}
            automaticOrientation={this.automaticOrientation}
            horizontal={this.horizontal}
            >
            {this.getSeries().map(({renderType, title, type, data}, idx) => (
              <ChartSeries
                key={title}
                id={title}
                type={renderType}
                title={title}
                data={data}
                dashStyle={"ShortDot"}
                yField="hookload"
                lineWidth={renderType === 'line' ? 2 : 0}
                color={this.getSeriesColor(type)} />
            )).toJS()}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors)) ||
        (nextProps.orientation !== this.props.orientation)
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  getSeries() {
    return this.getPredictedCurveSeries()
      .concat(this.getActualSeries());
  }

  getPredictedCurveSeries() {
    return this.getData().getIn(['data', 'curves'], List())
      .entrySeq()
      .flatMap(([curveType, curves]) =>
        curves.map((curve) => {
          let points = curve.get('points');
          points = this.props.convert.convertImmutables(points, 'hookload', 'mass', 'lb');
          return {
            renderType: 'line',
            title: `${SUPPORTED_CHART_SERIES[curveType].label} ${curve.get('openhole_friction_factor')}`,
            type: curveType,
            data: points
          };
        })
      );
  }

  getActualSeries() {
    return this.getData().getIn(['data', 'actual'], List())
      .entrySeq()
      .map(([curveType, points]) => {
        points = this.props.convert.convertImmutables(points, 'hookload', 'mass', 'lb');
        return {
          renderType: 'scatter',
          title: SUPPORTED_CHART_SERIES[curveType].label,
          type: curveType,
          data: points
        };
      });
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

  get automaticOrientation() {
    return this.props.orientation && this.props.orientation === 'auto';
  }

  get horizontal() {
    if (this.props.orientation) {
      return this.props.orientation === 'horizontal';
    }
    return true;
  }

}

BroomstickApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default BroomstickApp;
