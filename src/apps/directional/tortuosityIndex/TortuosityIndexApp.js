import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import { SUBSCRIPTIONS ,SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './TortuosityIndexApp.css';

class TortuosityIndexApp extends Component {
  render() {
    return (
      <div className="c-di-tortuosity">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            horizontal={false}
            xField="measured_depth"
            chartType="line"
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}
            gridLineWidth="1"
            xAxisWidth={2}
            xAxisColor="#fff"
            yAxisWidth={2}
            yAxisColor="#fff"
            xAxisTitle={{
              text: "Measure Depth",
              style: {
                color: "#fff"
              }
            }}
            yAxisTitle={{
              text: "Tortuosity",
              style: {
                color: "#fff"
              }
            }}
            >
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                type={renderType}
                key={field}
                id={field}
                title={title}
                data={data}
                yField={field}
                dashStyle={"Solid"}
                color={this.getSeriesColor(field)}
                />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    var dataChange = (nextProps.data !== this.props.data);
    var coordinatesChange = (nextProps.coordinates !== this.props.coordinates);
    var colorsChange = (nextProps.graphColors !== this.props.graphColors);
    return (dataChange || colorsChange || coordinatesChange);
  }

  getSeries() {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'points']);
    data = this.props.convert.convertImmutables(data, 'measured_depth', 'length' ,'ft');
    return Object.keys(SUPPORTED_CHART_SERIES)
      	.map(field => this.getDataSeries(field, data));
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
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }
}

TortuosityIndexApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default TortuosityIndexApp;

