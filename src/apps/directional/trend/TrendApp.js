import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS,SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import TrendChart from './TrendChart'
import './TrendApp.css'

class TrendApp extends Component {

  render() {
    return (
      <div className="c-di-trend">
        <div className="gaps"></div>
        {subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <TrendChart convert={this.props.convert} series={this.getSeries()} yAxes={this.getYAxes()} /> :
        <LoadingIndicator/> }
      </div>
    )
  }

  getYAxes() {
    return  [{
      titleText: 'TVD('+this.props.convert.GetUnitDisplay('length')+')', color:'#ffffff', others: { min:0, reversed:true }
    }, {
      titleText: 'GTF', color:'#add8e6' , others: { opposite:true }
    }, {
      titleText: 'DLS', color:'#0000ff', others: { opposite:true }
    }]
  }

  getSeries() {
    let tfo = this.getSeriesData("tfo",["measured_depth","tfo"]);
    tfo = this.props.convert.ConvertArray(tfo, 0, 'length', 'ft');

    let tvd_actual = this.getSeriesData("tvd_actual",["measured_depth","tvd"]);
    tvd_actual = this.props.convert.ConvertArray(tvd_actual, 0, 'length', 'ft');
    tvd_actual = this.props.convert.ConvertArray(tvd_actual, 1, 'length', 'ft');

    let tvd_plan = this.getSeriesData("tvd_plan",["measured_depth","tvd"]);
    tvd_plan = this.props.convert.ConvertArray(tvd_plan, 0, 'length', 'ft');
    tvd_plan = this.props.convert.ConvertArray(tvd_plan, 1, 'length', 'ft');

    let drilling_window = this.getSeriesData("drilling_window",["measured_depth","top","bottom"]);
    drilling_window = this.props.convert.ConvertArray(drilling_window, 0, 'length', 'ft');
    drilling_window = this.props.convert.ConvertArray(drilling_window, 1, 'length', 'ft');
    drilling_window = this.props.convert.ConvertArray(drilling_window, 2, 'length', 'ft');

    let dls = this.getSeriesData("dls",["measured_depth","dls"]);
    dls = this.props.convert.ConvertArray(dls, 0, 'length', 'ft');

    let seriesSetting = {
      tfo: {yAxis:1, data: tfo},
      tvd_actual: {yAxis:0, data: tvd_actual},
      tvd_plan: {yAxis:0,  data: tvd_plan},
      drilling_window: {yAxis:0, data: drilling_window, lineWidth:30},
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
      })
    })
  }
}

TrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default TrendApp;
