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
                   xAxis={this.getAxis(rawData.get("x_axis"), 'columns')}
                   yAxis={this.getAxis(rawData.get("y_axis"), 'rows', 'mass', 'lb')} />
        </div>
      );
    } catch (e) {
      return <div className="c-de-ropheatmap"><LoadingIndicator /></div>
    }
  }

  getAxis(axis, axisType, unitType=null, unit=null) {
    let max = axis.get("maximum");
    let min = axis.get("minimum");
    let axisLength = axis.get(axisType);

    if (unitType !== null) {
      max = this.props.convert.ConvertValue(max, unitType, unit);
      min = this.props.convert.ConvertValue(min, unitType, unit);
    }

    let unitSize = (max - min)/axisLength;
    return {
      categories: this.getAxisData(min, unitSize, axisLength),
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
    let toUnit = this.props.convert.GetUnitPreference('length');
    let series = [];
    let rows = data.get("y_axis").get("rows");
    let columns = data.get("x_axis").get("columns");
    for (let y = 0; y < rows; y++) {
      let row = data.get("rotary").get(y);
      for (let x = 0; x < columns; x++) {
        let z = row.get(x);
        z = z !== null ? this.props.convert.ConvertValue(z, 'length', 'ft', toUnit) : null;
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
