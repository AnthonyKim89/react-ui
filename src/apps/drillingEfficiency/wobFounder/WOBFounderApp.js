import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './WOBFounderApp.css'

class WOBFounder extends Component {

  render() {
    return (
      <div className="c-de-wobfounder">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            horizontal={true}
            xField="wob"
            chartType="scatter"
            size={this.props.size}
            widthCols={this.props.widthCols}
            gridLineWidth="0"
            xPlotLines={[{
              color: 'red',
              width: 1,
              value: subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'founder_value'])
            }]}>
            {this.getSeries().map(({renderType, title, field, data}, idx) => (
              <ChartSeries
                type="scatter"
                key={field}
                id={field}
                title={SUPPORTED_CHART_SERIES[field].label}
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
      .map(s => this.getDataSeries(s));
  }

  getDataSeries(field) {
    return {
      renderType: 'scatter',
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

WOBFounder.propTypes = {
  data: ImmutablePropTypes.map,
};

export default WOBFounder;
