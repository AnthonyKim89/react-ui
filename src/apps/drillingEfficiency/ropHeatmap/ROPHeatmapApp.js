import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './ROPHeatmapApp.css'

class ROPHeatmapApp extends Component {

  render() {
    try {
      let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).get("data");
      return (
        <div className="c-de-ropheatmap">
          <Heatmap title="ROP Heatmap"
                   series={this.getSeries(rawData)}
                   xAxis={this.getAxis(rawData.get("x_axis"))}
                   yAxis={this.getAxis(rawData.get("y_axis"))} />
        </div>
      );
    } catch (e) {
      return <div className="c-de-ropheatmap"><LoadingIndicator /></div>
    }
  }

  getAxis(axis, unitType=null, unit=null) {
    let max = axis.get("maximum");
    let min = axis.get("minimum");
    // TODO: Convert min and max to their appropriate units if types are provided.
    let rowHeight = (max - min)/axis.get("rows");
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
        z = z !== null ? this.props.convert.ConvertValue(z, 'length', 'ft') : null;
        series.push([y, x, z]);
      }
    }
    return {
      name: "ROP",
      data: series,
      borderWidth: 1,
      borderColor: "#444444",
      nullColor: "#535353",
      animation: false
    };
  }
}

ROPHeatmapApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default ROPHeatmapApp;
