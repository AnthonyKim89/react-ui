import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Heatmap from '../../../common/Heatmap';

import './MSEHeatmapApp.css';

class MSEHeatmapApp extends Component {

  render() {
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
    if (rawData) {
      rawData = rawData.get("data");
      return (
        <div className="c-de-mseheatmap">
          <Heatmap  series={this.getSeries(rawData)}
                    size={this.props.size}
                    coordinates={this.props.coordinates}
                    appSettings={this.props.appSettings}
                    colorStops={[
                      [0, '#00ff00'],                         
                      [0.5, '#ffff00'],
                      [1, '#ff0000']
                                       
                    ]}
                    xAxis={this.getAxis(rawData.get("x_axis"), 'rows')}
                    yAxis={this.getAxis(rawData.get("y_axis"), 'columns', 'mass', 'lb')} />
        </div>
      );
    }

    return <div className="c-de-mseheatmap"><LoadingIndicator /></div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || !nextProps.coordinates.equals(this.props.coordinates));
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
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object,
  appSettings: PropTypes.object,
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default MSEHeatmapApp;
