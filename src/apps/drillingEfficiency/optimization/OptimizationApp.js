import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import Gauge from '../../../common/Gauge';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './OptimizationApp.css';

class OptimizationApp extends Component {
  
  render() {
    let optimizationData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]);
    let witsData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);
    let actualData = (witsData && witsData.getIn(["data"])) || (optimizationData && optimizationData.getIn(["data", "actual"]));

    if (!optimizationData || !actualData) {
      return <LoadingIndicator />;
    }

    let gaugeValue = this.getGaugeValue(optimizationData.getIn(['data', 'efficiency']));  
    let activity_state = actualData.getIn(['state']);
    let drilling_state = (activity_state === "SlideDrilling" || activity_state === "DrillSlide(Slide mode drilling)" || activity_state === "RotaryDrilling" || activity_state === "DrillRot(Rotary mode drilling)");

    return (
      <div className="c-de-optimization">
        <Row>
            <Col s={12} m={4} className="c-de-optimization__gauge">
              <div className="c-de-optimization__gauge-title">Drilling Efficiency</div>
              {gaugeValue !== null ? 
                <Gauge widthCols={this.props.widthCols}
                     bands={this.getGaugeBands()}
                     value={gaugeValue} /> : ""}
            </Col>
            <Col m={8} className="c-de-optimization__info">
              <div className="c-de-optimization__gauge-title">Parameter Optimization</div>
              {!drilling_state ? <div className="c-de-optimization__off-botom">Current Activity: Off-bottom</div> : ""}
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
                    <td style={this.getStyles(actualData,optimizationData,"wob", activity_state)}> {this.props.convert.convertValue(actualData.getIn([this.getParamKey("actual","wob")]), "force", "klbf").formatNumeral("0.0")}</td>
                    { /* TODO: Add back in: this.getStyles(actualData,optimizationData,"mud_flow_in") */ }
                    <td> {this.props.convert.convertValue(parseFloat(actualData.getIn([this.getParamKey("actual","flow")])), "volume", "gal").formatNumeral("0.0")}</td>
                    <td style={this.getStyles(actualData, optimizationData, "rpm", activity_state)}>{numeral(actualData.getIn([this.getParamKey("actual","rpm")])).format("0")}</td>
                  </tr>
                  {this.renderSection(optimizationData, "Rotary", "recommended_rotary")}
                  {this.renderSection(optimizationData, "Slide", "recommended_slide")}
                </tbody>
              </table>
            </Col>  
          </Row>                
      </div>
    );
  }

  renderSection(optimizationData, title, section) {
    let section_present = optimizationData.getIn(["data",section]) !== null && optimizationData.getIn(["data",section]).count() > 0;  
    return (
      <tr>
        <td>{title}</td>
        <td>
          { 
            section_present ? 
            (this.props.convert.convertValue(optimizationData.getIn(["data",section, this.getParamKey("optimization","min_wob")]), "force", "klbf").formatNumeral("0.0") + " - " + this.props.convert.convertValue(optimizationData.getIn(["data",section,this.getParamKey("optimization","max_wob")]), "force", "klbf").formatNumeral("0.0"))
            : "-"}
        </td>
        <td>
          { section_present && false ? 
          (this.props.convert.convertValue(optimizationData.getIn(["data",section, this.getParamKey("optimization","min_flow")]), "volume", "gal").formatNumeral("0.0") -
          this.props.convert.convertValue(optimizationData.getIn(["data",section, this.getParamKey("optimization","max_flow")]), "volume", "gal").formatNumeral("0.0")) : "-"}
        </td>
        <td>
          { 
            section_present ? 
            (numeral(optimizationData.getIn(["data",section, this.getParamKey("optimization","min_rpm")])).format("0") + " - " + numeral(optimizationData.getIn(["data",section,this.getParamKey("optimization","max_rpm")])).format("0"))
            : "-"}
        </td>
    </tr>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || !nextProps.coordinates.equals(this.props.coordinates));
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
      case 'optimal': return 25;
      default: return null;
    }
  }

  getParamKey(modeString, shortName) {
    let keys ={
      "actual" : {
        "wob" : "weight_on_bit",
        "flow" : "mud_flow_in",
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

  getStyles(actualData, optimizationData, param, activity_state="RotaryDrilling") {
    let activity_category = "recommended_rotary";
    if(activity_state === "SlideDrilling") {
        activity_category = "recommended_slide";
    }
    if(activity_state !== "SlideDrilling" || activity_state !== "RotaryDrilling") {
      return {color: "#ffffff"};
    }

    let actualVal = actualData.getIn([this.getParamKey("actual", param)]);
    let optMinVal = optimizationData.getIn(["data", activity_category, this.getParamKey("optimization","min_"+param)]);
    let optMaxVal = optimizationData.getIn(["data", activity_category, this.getParamKey("optimization","max_"+param)]);
    
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
