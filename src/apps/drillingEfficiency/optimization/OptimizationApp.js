import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Gauge from '../../../common/Gauge';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './OptimizationApp.css';

class OptimizationApp extends Component {
  
  render() {
    let optimizationData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]);
    let actualData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);

    if (!optimizationData || !actualData) {
      return <LoadingIndicator />;
    }
    
    return (
      <div className="c-de-optimization">
        <Row>
            <Col s={12} m={4} className="c-de-optimization__gauge">
              <div className="c-de-optimization__gauge-title">Drilling Efficiency</div>
              <Gauge widthCols={this.props.widthCols}
                     bands={this.getGaugeBands()}
                     value={this.getGaugeValue(optimizationData.getIn(['data', 'efficiency']))} />
            </Col>
            <Col m={8} className="c-de-optimization__info">
              <div className="c-de-optimization__gauge-title">Parameter Optimization</div>
              <table>
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>
                      WOB <sub> k{this.props.convert.getUnitDisplay('mass')}f </sub>
                    </th>
                    <th>
                      FLOW <sub> {this.props.convert.getUnitDisplay('volume')}pm </sub>
                    </th>
                    <th>
                      RPM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Actual </td>
                    <td style={this.getStyles(actualData,optimizationData,"wob")}> {this.props.convert.convertValue(actualData.getIn(["data",this.getParamKey("actual","wob")]), "mass", "lb").fixFloat(1)}</td>
                    <td style={this.getStyles(actualData,optimizationData,"flow")}> {this.props.convert.convertValue(actualData.getIn(["data",this.getParamKey("actual","flow")]), "volume", "gal").fixFloat(1)}</td>
                    <td style={this.getStyles(actualData,optimizationData,"rpm")}> {actualData.getIn(["data",this.getParamKey("actual","rpm")])}</td>
                  </tr>
                  <tr>
                    <td> Rotary </td>
                    <td> 
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_wob")]), "mass", "lb").fixFloat(1)} -
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_wob")]), "mass", "lb").fixFloat(1)}
                    </td>
                    <td>
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_flow")]), "volume", "gal").fixFloat(1)} -
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_flow")]), "volume", "gal").fixFloat(1)}
                    </td>
                    <td>
                      {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","min_rpm")])} - 
                      {optimizationData.getIn(["data","recommended_rotary", this.getParamKey("optimization","max_rpm")])}
                    </td>
                  </tr>
                  <tr>
                    <td> Slide </td>
                    <td> 
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","min_wob")]), "mass", "lb").fixFloat(1)} -
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","max_wob")]), "mass", "lb").fixFloat(1)}
                    </td>
                    <td>
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","min_flow")]), "volume", "gal").fixFloat(1)} -
                      {this.props.convert.convertValue(optimizationData.getIn(["data","recommended_slide", this.getParamKey("optimization","max_flow")]), "volume", "gal").fixFloat(1)}
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
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates);
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
    };
    return keys[modeString][shortName];
  }

  getStyles(actualData, optimizationData, param , activityState="recommended_rotary") {
    let actualVal = actualData.getIn(["data",this.getParamKey("actual",param)]);
    let optMinVal = optimizationData.getIn(["data",activityState,this.getParamKey("optimization","min_"+param)]);
    let optMaxVal = optimizationData.getIn(["data",activityState,this.getParamKey("optimization","max_"+param)]);
    
    if (actualVal > optMinVal && actualVal < optMaxVal ) {
      return {color: "#00ff00"};
    }
    else if (actualVal > optMinVal - optMinVal * 0.1 && actualVal < optMaxVal + optMaxVal * 0.1) {
      return {color: "#ffff00"};
    }
    else {
     return {color: "#ff0000"};
    }
  }
}

OptimizationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default OptimizationApp;
