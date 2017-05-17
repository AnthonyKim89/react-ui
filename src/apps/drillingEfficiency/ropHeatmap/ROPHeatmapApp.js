import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './ROPHeatmapApp.css';

class ROPHeatmapApp extends Component {

  render() {
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);

    if (rawData) {
      rawData = rawData.get("data");
      return (
        <div className="c-de-ropheatmap">
          <Heatmap series={this.getSeries(rawData)}
                    size={this.props.size}
                    coordinates={this.props.coordinates}
                    tooltipPointFormatter={this.getPointFormat}
                    xAxis={this.getAxis(rawData.get("x_axis"), 'rows')}
                    yAxis={this.getAxis(rawData.get("y_axis"), 'columns', 'mass', 'lb')} />
        </div>
      );
    }

    return <div className="c-de-ropheatmap"><LoadingIndicator /></div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || !nextProps.coordinates.equals(this.props.coordinates));
  }

  getPointFormat(point) {
    var x = this.series.xAxis.userOptions.categories[this.x || 0];
    var y = this.series.yAxis.userOptions.categories[this.y || 0];
    return `RPM: <b>${x}</b><br/>Weight on Bit: <b>${y}</b><br/>ROP: <b>${this.value.formatNumeral('0,0.00')}</b><br/>`;
  }

  getAxis(axis, axisType, unitType=null, unit=null) {
    let max = axis.get("maximum");
    let min = axis.get("minimum");
    let axisLength = axis.get(axisType);

    if (unitType !== null) {
      max = this.props.convert.convertValue(max, unitType, unit);
      min = this.props.convert.convertValue(min, unitType, unit);
    }

    let unitSize = (max - min)/axisLength;
    return {
      categories: this.getAxisData(min, unitSize, axisLength),
      title: axis.get("type").toUpperCase(),
    };
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
    let toUnit = this.props.convert.getUnitPreference('length');
    let series = [];
    let rows = data.get("x_axis").get("rows");
    let columns = data.get("y_axis").get("columns");
    for (let y = 0; y < rows; y++) {
      let row = data.get("rotary").get(y);
      for (let x = 0; x < columns; x++) {
        let z = row.get(x);
        z = z !== null ? this.props.convert.convertValue(z, 'length', 'ft', toUnit) : null;
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
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default ROPHeatmapApp;
