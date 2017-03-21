import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './Prev300App.css'


class Prev300App extends Component {

  render() {
        
    return (
      <div className="c-di-prev300">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            horizontal={true}
            xField="vertical_section"
            size={this.props.size}
            widthCols={this.props.widthCols}
            gridLineWidth="1"
            xAxisWidth={2}
            xAxisColor="#fff"
            yAxisWidth={2}
            yAxisColor="#fff"
            xAxisTitle={{
              text: "Vertical section",
              style: {
                color: "#fff"
              }
            }}
            yAxisTitle={{
              text: "True Vertical Depth",
              style: {
                color: "#fff"
              }
            }}
            yAxisReversed={true}>

            {this.getSeries().map(({renderType, title, field, marker, data}, idx) => (
              <ChartSeries
                type={renderType}
                key={field}
                id={field}
                title={title}
                data={data}
                marker={marker}
                yField={"tvd"}
                dashStyle={"Solid"}
                color={this.getSeriesColor(field)}
                />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    )
  }

  getSeries() {
    return Object.keys(SUPPORTED_CHART_SERIES)
        .map(field => this.getDataSeries(field));    
  }

  getDataSeries(field) {
    let data = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', field ])
    let startIndex = (data.size - 15 >= 0) ? data.size - 15 : 0;

    return {
      renderType: SUPPORTED_CHART_SERIES[field].chartType,
      title: field,
      field,
      marker: { radius: 2},
      data: subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', field ]).slice(startIndex)
    };
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

}

Prev300App.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default Prev300App;

