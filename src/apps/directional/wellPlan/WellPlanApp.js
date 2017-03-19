import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import WellPlanChart from './WellPlanChart'

import './WellPlanApp.css'


class WellPlanApp extends Component {

  render() {
    return (
      <div className="c-di-wellplan">
        <div className="gaps"></div>
        {subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <WellPlanChart series={this.getSeries()}/> :
        <LoadingIndicator/> }
      </div>
    )
  }

  getSeries() {
    return [{      
      color: '#add8e6',
      name:'actual',
      data: this.getSeriesData("actual",["vertical_section","tvd"])
    },{
      
      color:'#ff0000',
      name: 'plan',
      data: this.getSeriesData("plan",["vertical_section","tvd"])
    }];
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

WellPlanApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default WellPlanApp;

