import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import LoadingIndicator from '../../../common/LoadingIndicator';
import TrendChart from '../../../common/TrendChart';
import subscriptions from '../../../subscriptions';

import {
  SUBSCRIPTIONS,
  SUPPORTED_CHART_SERIES
} from './constants';

import './PressureTrendApp.css';

class PressureTrendApp extends Component {

  render() {
    return (
      this.data ?
        <div className="c-hydraulics-pressure-trend">
          <TrendChart
            convert={this.props.convert}
            series={this.series}
            xAxisTitle={'Measured Depth ('+this.props.convert.getUnitDisplay('length')+')'}
            yAxes={this.yAxes}
          />
        </div> :
        <LoadingIndicator />
    );
  }

  get data() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  get yAxes() {
    return  [{
      titleText: `EMW (pp${this.props.convert.getUnitDisplay('volume')})`,
      color:'#ffffff'
    }, {
      titleText: this.props.convert.getUnitDisplay('pressure').toUpperCase(),
      color:'#ffffff' ,
      others: { opposite:true }
    }];
  }

  get series() {
    let mudWeight = this.getSeriesData("mud_weight", ["measured_depth", "value"]);
    mudWeight = this.props.convert.convertArray(mudWeight, 0, 'length', 'ft');
    mudWeight = this.props.convert.convertArray(mudWeight, 1, 'volume', 'gal');

    let equivalentCirculatingDensity = this.getSeriesData(
        "equivalent_circulating_density", ["measured_depth", "value"]);
    equivalentCirculatingDensity = this.props.convert.convertArray(
        equivalentCirculatingDensity, 0, 'length', 'ft');
    equivalentCirculatingDensity = this.props.convert.convertArray(
        equivalentCirculatingDensity, 1, 'volume', 'gal');

    let standpipePressure = this.getSeriesData(
        "standpipe_pressure", ["measured_depth", "value"]);
    standpipePressure = this.props.convert.convertArray(standpipePressure, 0, 'length', 'ft');
    standpipePressure = this.props.convert.convertArray(standpipePressure, 1, 'pressure', 'psi');

    let seriesSetting = {
      mudWeight: {
        yAxis: 0,
        data: mudWeight
      },
      equivalentCirculatingDensity: {
        yAxis: 0,
        data: equivalentCirculatingDensity
      },
      standpipePressure: {
        yAxis: 1,
        data: standpipePressure
      }
    };

    return Object.keys(SUPPORTED_CHART_SERIES).map( (field) => {
      return Object.assign(
        {},
        seriesSetting[field],
        SUPPORTED_CHART_SERIES[field],
        {name: SUPPORTED_CHART_SERIES[field].label, color:this.getSeriesColor(field)}
      );
    });
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

  getSeriesData(serieName, keys) {
    let rawData = subscriptions.selectors.firstSubData(
        this.props.data, SUBSCRIPTIONS).getIn(['data', serieName]).toJSON();
    return rawData.map((t) => {
      return keys.map(key => {
        return t[key];
      });
    });
  }

}

PressureTrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureTrendApp;
