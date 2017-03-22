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
          <TrendChart series={this.getSeries()} yAxes={this.getYAxes()} /> :
        <LoadingIndicator/> }
      </div>
    )
  }

  getYAxes() {
    return  [{
      titleText: 'TVD(n)', color:'#ffffff', others: { min:0, reversed:true }
    }, {
      titleText: 'GTF', color:'#add8e6' , others: { opposite:true }
    }, {
      titleText: 'DLS', color:'#0000ff', others: { opposite:true }
    }]
  }

  getSeries() {
    let serieSetting = {
      tfo: {yAxis:1, data: this.getSeriesData("tfo",["measured_depth","tfo"]) },
      tvd_actual: {yAxis:0, data: this.getSeriesData("tvd_actual",["measured_depth","tvd"]) },
      tvd_plan: {yAxis:0,  data: this.getSeriesData("tvd_plan",["measured_depth","tvd"]) },
      drilling_window: {yAxis:0, data:this.getSeriesData("drilling_window",["measured_depth","top","bottom"]) , lineWidth:30},
      dls: {yAxis:2, data: this.getSeriesData("dls",["measured_depth","dls"]) },
    }

    return Object.keys(SUPPORTED_CHART_SERIES)
        .map( (field) => {
            return Object.assign({}, 
                serieSetting[field],
                SUPPORTED_CHART_SERIES[field], 
                {name: SUPPORTED_CHART_SERIES[field].label,color:this.getSeriesColor(field)});
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
    return rawData.map( (t) => {
      return keys.map( key=> {
        return t[key]
      })
    })
  } 

}

TrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default TrendApp;

