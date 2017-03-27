import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './DPFounderApp.css';

class DPFounder extends Component {

  render() {
    return (
      <div className="c-de-dpfounder">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            horizontal={true}
            xField="dp"
            chartType="scatter"
            size={this.props.size}
            widthCols={this.props.widthCols}
            gridLineWidth="0"
            xAxisWidth={2}
            xAxisColor="#fff"
            yAxisWidth={2}
            yAxisColor="#fff"
            xAxisTitle={{
              text: "Differential Pressure",
              style: {
                color: "#fff"
              }
            }}
            yAxisTitle={{
              text: "ROP",
              style: {
                color: "#fff"
              }
            }}
            xPlotLines={[{
              color: 'red',
              width: 1,
              value: this.props.convert.ConvertValue(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'founder_value']), 'pressure', 'psi'),
            }]}>
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                type="scatter"
                key={field}
                id={field}
                title={title}
                data={data}
                yField={field}
                color={this.getSeriesColor(field)}
                marker={{
                  enabled: true,
                  radius: 2
                }} />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getSeries() {
    return Object.keys(SUPPORTED_CHART_SERIES)
      .map(field => this.getDataSeries(field));
  }

  getDataSeries(field) {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'points']);
    data = this.props.convert.ConvertImmutables(data, field, SUPPORTED_CHART_SERIES[field].unitType, SUPPORTED_CHART_SERIES[field].unit);
    data = this.props.convert.ConvertImmutables( data, 'dp', 'pressure', 'psi');

    return {
      renderType: 'scatter',
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

DPFounder.propTypes = {
  data: ImmutablePropTypes.map,
};

export default DPFounder;
