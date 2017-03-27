import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './SurveysApp.css';

class SurveysApp extends Component {
  render() {
  	let json = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS);
    return (
      <div className="c-di-surveys">
        <div className="gaps"></div>
        { json ?
        	
          <table>
            <thead>
              <tr>
                <th>Depth</th>
                <th>Inc</th>
                <th>Azi</th>
                <th>DLS</th>
              </tr>
            </thead>
            <tbody>
              { 

              	json.getIn(["data","actual"]).slice(0,5).map( (t,index)=> {
	                return (
	                <tr key={index}>
	                  <td>{this.props.convert.convertValue(t.get("measured_depth"), 'length', 'ft').fixFloat(1)} <sub> {this.props.convert.getUnitDisplay('length')}</sub></td>
	                  <td>{t.get("inclination").fixFloat(2)} <sub>*</sub></td>
	                  <td>{t.get("azimuth").fixFloat(2)} <sub>*</sub></td>
	                  <td>{t.get("dls").fixFloat(2)}</td>
	                </tr>
                );

              })}
            </tbody>
          </table>:
        <LoadingIndicator/> 
        }
      </div>
    );
  }
}

SurveysApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SurveysApp;
