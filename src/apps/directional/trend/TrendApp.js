import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import TrendChart from '../../../common/TrendChart';
import subscriptions from '../../../subscriptions';

import './TrendApp.css';

class TrendApp extends Component {

  render() {
    let actualData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]);
    let planData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);

    return (
      actualData && planData ?
      <div className="c-di-trend">
        <div className="gaps"></div>
          <TrendChart
            convert={this.props.convert}
            coordinates={this.props.coordinates}
            series={this.getSeries()}
            xAxisTitle={'Measured Depth ('+this.props.convert.getUnitDisplay('length')+')'}
            yAxes={this.getYAxes()}
          />
      </div> : <LoadingIndicator/>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }

  getYAxes() {
    return  [{
      titleText: 'TVD('+this.props.convert.getUnitDisplay('length')+')', color:'#ffffff', others: { min:0, reversed:true }
    }, {
      titleText: 'DLS', color:'#0000ff', others: { opposite:true }
    }];
  }

  getSeries() {
    

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
      tvd_actual: {yAxis:0, data: tvdActual},
      tvd_plan: {yAxis:0,  data: tvdPlan},
      drilling_window: {yAxis:0, data: drillingWindow, lineWidth:30, zIndex:-999},
      dls: {yAxis:1, data: dls},
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
    let subscriptionIndex; //actual by default;
    switch(serieName) {
      case 'tvd_actual':
        subscriptionIndex = 0;
        break;
      case 'tvd_plan':
        subscriptionIndex = 1;
        break;
      case 'drilling_window':
        subscriptionIndex = 1;
        break;
      case 'dls':
        subscriptionIndex = 0;
        break;
      default:
        subscriptionIndex = 0;
    }
    let rawData = subscriptions.selectors.getSubData(this.props.data, SUBSCRIPTIONS[subscriptionIndex]).getIn(['data', 'stations']).toJSON();
    return rawData.map((t) => {
      if (serieName === 'drilling_window') {
        return [t["measured_depth"], Math.max(t["tvd"]-10,0), t["tvd"]+10];
      }
      else {
        return keys.map(key => {        
          return t[key];
        });
      }
    });
  }
}

TrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default TrendApp;
