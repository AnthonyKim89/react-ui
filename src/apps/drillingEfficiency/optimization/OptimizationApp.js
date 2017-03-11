import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Gauge from '../../../common/Gauge';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';


import './OptimizationApp.css'

class OptimizationApp extends Component {
  
  render() {
    let optimizationData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]);
    let actualData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);
    
    return (
      <div className="c-de-optimization">
        { optimizationData && actualData ?
          <Row>
              <Col s={5} className="c-de-optimization__gauge">
                <div className="c-de-optimization__gauge-title">Drilling Efficiency</div>
                <Gauge widthCols={this.props.widthCols}
                       bands={this.getGaugeBands()}
                       value={this.getGaugeValue(optimizationData.getIn(['data', 'efficiency']))} />
              </Col>
              <Col s={7}>
                <div className="c-de-optimization__gauge-title">Parameter Optimization</div>
                <table>
                  <thead>
                    <tr>
                      <th>Mode</th>
                      <th>
                        WOB <sub> klbf </sub>
                      </th>
                      <th>
                        FLOW <sub> gpm </sub>
                      </th>
                      <th>
                        RPM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td> Actual </td>
                      <td style={this.getStyles(actualData,optimizationData,"wob")}> {actualData.getIn(["data",this.getParamKey("actual","wob")])}</td>
                      <td style={this.getStyles(actualData,optimizationData,"flow")}> {actualData.getIn(["data",this.getParamKey("actual","flow")])}</td>
                      <td style={this.getStyles(actualData,optimizationData,"rpm")}> {actualData.getIn(["data",this.getParamKey("actual","rpm")])}</td>
                    </tr>
                    <tr>
                      <td> Rotary </td>
                      <td> 
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_wob")])} - 
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_wob")])} 
                      </td>
                      <td>
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_flow")])} -
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_flow")])} 
                      </td>
                      <td>
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_rpm")])} - 
                        {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_rpm")])}
                      </td>
                    </tr>
                    <tr>
                      <td> Rotary </td>
                      <td> 
                        {optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","min_wob")])} - 
                        {optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","max_wob")])} 
                      </td>
                      <td>
                        {optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","min_flow")])} - 
                        {optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","max_flow")])} 
                      </td>
                      <td>
                        {optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","min_rpm")])} -
                        {optimizationData.getIn(["data","recommended_slide",this.getParamKey("optimization","max_rpm")])}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>  
            </Row>
          : <LoadingIndicator />
        }
      </div>
    );
  }

  getGaugeBands() {
    return {
      red:    {from: 0,  to: 10},
      yellow: {from: 10, to: 20},
      green:  {from: 20, to: 30}
    };
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 5;
      case 'moderate': return 15;
      case 'high': return 25;
      default: return null;
    }
  }

  getParamKey(modeString, shortName) {
    let keys ={
      "actual" : {
        "wob" : "weight_on_bit",
        "flow" : "total_pump_output",
        "rpm" : "rotary_rpm",
      }, 
      "optimization": {
        "min_wob" : "min_weight_on_bit",
        "min_flow" : "min_mud_flow_in",
        "min_rpm" : "min_rpm",
        "max_wob" : "max_weight_on_bit",
        "max_flow" : "max_mud_flow_in",
        "max_rpm" : "max_rpm",
      }
    }
    return keys[modeString][shortName];
  }

  getStyles(actualData, optimizationData, param , activityState="recommended_rotary") {
    let style = {
      fontWeight: "bold"
    }

    let actualVal = actualData.getIn(["data",this.getParamKey("actual",param)]);
    let optMinVal = optimizationData.getIn(["data",activityState,this.getParamKey("optimization","min_"+param)]);
    let optMaxVal = optimizationData.getIn(["data",activityState,this.getParamKey("optimization","max_"+param)]);
    
    if (actualVal > optMinVal && actualVal < optMaxVal ) {
      return Object.assign(style, {color: "#00ff00"});
    }
    else if (actualVal > optMinVal - optMinVal * 0.1 && actualVal < optMaxVal + optMaxVal * 0.1) {
      return Object.assign(style, {color: "#ffff00"});
    }
    else {
     return Object.assign(style, {color: "#ff0000"}); 
    }
  }
  
}

OptimizationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default OptimizationApp;
