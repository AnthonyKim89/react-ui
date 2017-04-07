import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import TrendChart from '../../../common/TrendChart';
import subscriptions from '../../../subscriptions';

import './TrendApp.css';

class TrendApp extends Component {

  render() {
    return (
      <div className="c-di-trend">
        <div className="gaps"></div>
        {subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <TrendChart
            convert={this.props.convert}
            coordinates={this.props.coordinates}
            series={this.getSeries()}
            xAxisTitle={'Measured Depth ('+this.props.convert.getUnitDisplay('length')+')'}
            yAxes={this.getYAxes()}
          /> :
        <LoadingIndicator/> }
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    var dataChange = (nextProps.data !== this.props.data);
    var coordinatesChange = (nextProps.coordinates !== this.props.coordinates);
    var colorsChange = (nextProps.graphColors !== this.props.graphColors);
    return (dataChange || colorsChange || coordinatesChange);
  }

  getYAxes() {
    return  [{
      titleText: 'TVD('+this.props.convert.getUnitDisplay('length')+')', color:'#ffffff', others: { min:0, reversed:true }
    }, {
      titleText: 'GTF', color:'#add8e6' , others: { opposite:true }
    }, {
      titleText: 'DLS', color:'#0000ff', others: { opposite:true }
    }];
  }

  getSeries() {
    let tfo = this.getSeriesData("tfo",["measured_depth","tfo"]);
    tfo = this.props.convert.convertArray(tfo, 0, 'length', 'ft');

    let tvdActual = this.getSeriesData("tvd_actual",["measured_depth","tvd"]);
    tvdActual = this.props.convert.convertArray(tvdActual, 0, 'length', 'ft');
    tvdActual = this.props.convert.convertArray(tvdActual, 1, 'length', 'ft');

    let tvdPlan = this.getSeriesData("tvd_plan",["measured_depth","tvd"]);
    tvdPlan = this.props.convert.convertArray(tvdPlan, 0, 'length', 'ft');
    tvdPlan = this.props.convert.convertArray(tvdPlan, 1, 'length', 'ft');

    let drillingWindow = this.getSeriesData("drilling_window",["measured_depth","top","bottom"]);
    drillingWindow = this.props.convert.convertArray(drillingWindow, 0, 'length', 'ft');
    drillingWindow = this.props.convert.convertArray(drillingWindow, 1, 'length', 'ft');
    drillingWindow = this.props.convert.convertArray(drillingWindow, 2, 'length', 'ft');

    let dls = this.getSeriesData("dls",["measured_depth","dls"]);
    dls = this.props.convert.convertArray(dls, 0, 'length', 'ft');

    let seriesSetting = {
      tfo: {yAxis:1, data: tfo},
      tvd_actual: {yAxis:0, data: tvdActual},
      tvd_plan: {yAxis:0,  data: tvdPlan},
      drilling_window: {yAxis:0, data: drillingWindow, lineWidth:30},
      dls: {yAxis:2, data: dls},
    };

    return Object.keys(SUPPORTED_CHART_SERIES).map( (field) => {
      return Object.assign(
        {},
        seriesSetting[field],
        SUPPORTED_CHART_SERIES[field],
        {name: SUPPORTED_CHART_SERIES[field].label,color:this.getSeriesColor(field)}
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
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', serieName]).toJSON();
    return rawData.map((t) => {
      return keys.map(key => {
        return t[key];
      });
    });
  }
}

TrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default TrendApp;
