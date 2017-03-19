import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
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
    return [{
        name: 'GTF', type: 'scatter', yAxis:1, color: '#add8e6', data: this.getSeriesData("tfo",["measured_depth","tfo"]) }, {
        name: 'Well Path', type:'line', yAxis:0, color:'#00ff00', data: this.getSeriesData("tvd_actual",["measured_depth","tvd"])}, {
        name: 'Planned Well Path', type:'line', yAxis: 0, color: '#ff0000', data: this.getSeriesData("tvd_plan",["measured_depth","tvd"])}, {
        name: 'Drilling Window', type:'arearange', yAxis: 0, color: 'rgba(255,255,0,0.5)', data: this.getSeriesData("drilling_window",["measured_depth","top","bottom"]) , lineWidth:30 } , {
        name: 'DLS', type:'line', yAxis: 2, color: '#0000ff', data: this.getSeriesData("dls",["measured_depth","dls"])
      }]
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

