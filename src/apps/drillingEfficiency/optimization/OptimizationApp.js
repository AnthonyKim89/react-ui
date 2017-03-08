import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Gauge from '../../../common/Gauge';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
//import Heatmap from '../../../common/Heatmap';

import './OptimizationApp.css'

class OptimizationApp extends Component {
  
  render() {

    return (
      <div className="c-de-optimization">
        { subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <div>          
            <Row></Row>            
            <Row>
                <Col s={6} className="c-de-optimization__gauge">
                  <div className="c-de-optimization__gauge-title">Drilling Efficiency</div>                  
                  <Gauge widthCols={this.props.widthCols}
                         bands={this.getGaugeBands()}
                         value={this.getDrillingEfficiencyGaugeValue()} />                  
                </Col>
                <Col s= {6}>
                  <div className="c-de-optimization__gauge-title">Parameter Optimization</div>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
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
                        <td> Current </td>
                        <td> {this.getDrillingOptimizationParameters("actual","weight_on_bit")}</td>
                        <td> {this.getDrillingOptimizationParameters("actual","mud_flow_in")} </td>
                        <td> {this.getDrillingOptimizationParameters("actual","rpm")} </td>
                      </tr>
                      <tr>
                        <td> Rotary </td>
                        <td> {this.getDrillingOptimizationParameters("recommended_rotary","weight_on_bit")}</td>
                        <td> {this.getDrillingOptimizationParameters("recommended_rotary","mud_flow_in")}</td>
                        <td> {this.getDrillingOptimizationParameters("recommended_rotary","rpm")}</td>
                      </tr>
                      <tr>
                        <td> Slide </td>
                        <td> {this.getDrillingOptimizationParameters("recommended_slide","weight_on_bit")}</td>
                        <td> {this.getDrillingOptimizationParameters("recommended_slide","mud_flow_in")}</td>
                        <td> {this.getDrillingOptimizationParameters("recommended_slide","rpm")}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>  
              </Row>
            </div>
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

  getDrillingEfficiencyGaugeValue() {
    return this.getGaugeValue(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'efficiency']));
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 5;
      case 'moderate': return 15;
      case 'high': return 25;
      default: return null;
    }
  }

  getDrillingOptimizationParameters(key,parameter) {
      return subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(['data',key,parameter]);
  }

}

OptimizationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default OptimizationApp;
