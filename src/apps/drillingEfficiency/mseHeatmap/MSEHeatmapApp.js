import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './MSEHeatmapApp.css'

class MSEHeatmapApp extends Component {

  render() {
    try {
      let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).get("data");
      return (
        <div className="c-de-mseheatmap">
          <Heatmap title="MSE Heatmap"
                   series={this.getSeries(rawData)}
                   xAxis={this.getAxis(rawData.get("x_axis"))}
                   yAxis={this.getAxis(rawData.get("y_axis"))} />
        </div>
      );
    } catch (e) {
      return <div className="c-de-mseheatmap"><LoadingIndicator /></div>
    }
  }

  getAxis(axis) {
    let rowHeight = (axis.get("maximum") - axis.get("minimum"))/axis.get("rows");
    return {
      categories: this.getAxisData(axis.get("minimum"), rowHeight, axis.get("rows")),
      title: axis.get("type").toUpperCase(),
    }
  }

  getAxisData(start, unitSize, axisLength) {
    let data = [];
    for (let i = 0; i < axisLength; i++) {
      let nextStart = start + unitSize;
      data.push(Math.round(start));
      start = nextStart;
    }
    return data;
  }

  getSeries(data) {
    let series = [];
    let rows = data.get("y_axis").get("rows");
    let columns = data.get("x_axis").get("columns");
    for (let y = 0; y < rows; y++) {
      let row = data.get("rotary").get(y);
      for (let x = 0; x < columns; x++) {
        let z = row.get(x);
        series.push([y, x, z]);
      }
    }
    return {
      name: "MSE",
      data: series,
      borderWidth: 1,
      borderColor: "#444444",
      nullColor: "#535353",
      animation: false
    };
  }
}

MSEHeatmapApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default MSEHeatmapApp;
