import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './AxialLoadApp.css';

class AxialLoadApp extends Component {

  render() {
    return (
      <div className="c-tnd-axial-load">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            xField="measured_depth"
            size={this.props.size}
            areaSplineThreshold={null}            
            automaticOrientation={this.automaticOrientation}
            horizontal={this.horizontal}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, field, data, fillOpacity}, idx) => (
              <ChartSeries
                dashStyle='Solid'
                lineWidth={2}
                key={field}
                id={field}
                type={renderType}
                title={SUPPORTED_CHART_SERIES[field].label}
                data={data}
                yField={field}
                fillOpacity={fillOpacity}
                color={this.getSeriesColor(field)} />
            ))}
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

  getSeries() {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'points']);
    data = this.props.convert.convertImmutables(data, 'measured_depth', 'length', 'ft')
      .sortBy(d => d.get('measured_depth'));
    // Converting each of our y-axis values to their target unit.
    for (let property in SUPPORTED_CHART_SERIES) {
      if (SUPPORTED_CHART_SERIES.hasOwnProperty(property)) {
        data = this.props.convert.convertImmutables(data, property, SUPPORTED_CHART_SERIES[property].unitType, SUPPORTED_CHART_SERIES[property].unit);
      }
    }
    return Object.keys(SUPPORTED_CHART_SERIES)
      .map(s => this.getDataSeries(s, data));
  }

  getDataSeries(field, data) {
    switch (field) {
      case 'helical_buckling_force':
        return {
          renderType: 'areaspline',
          title: field,
          field,
          data: data,
          fillOpacity: 0.3
        };
      case 'sinusoidal_buckling_force':
          return {
            renderType: 'line',
            title: field,
            field,
            data: data,
            fillOpacity: 0.0
          };
      default:
        return {
          renderType: 'line',
          title: field,
          field,
          data: data,
          fillOpacity: 0.0
        };
    }
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    } else {
      return SUPPORTED_CHART_SERIES[field].defaultColor;
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

AxialLoadApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default AxialLoadApp;
