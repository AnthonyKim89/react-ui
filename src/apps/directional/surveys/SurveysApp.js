import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './SurveysApp.css';

class SurveysApp extends Component {
  render() {
  	let json = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS);
    if (!json) {
      return (        
        <LoadingIndicator/>
      );
    }

    let data = json.getIn(["data","actual"]).slice(0,5);
    if (this.props.maximize) {
      data = json.getIn(["data","actual"]);
    }
    else {
      data = json.getIn(["data","actual"]).slice(0,5);
    }
    
    return (
      <div className="c-di-surveys">
        <div className="c-di-surveys-head">
          <div className="c-di-surveys-head-inner">
            <table>
              <thead>
                <tr>
                  <th style={this.getCellStyle()}>Depth <span>({this.props.convert.getUnitDisplay('length')})</span></th>
                  <th style={this.getCellStyle()}>Inc <span>(°)</span></th>
                  <th style={this.getCellStyle()}>Azi <span>(°)</span></th>
                  <th style={this.getCellStyle()}>DLS <span>(°/{this.props.convert.convertValue(100, 'length', 'ft').fixFloat(1)}{this.props.convert.getUnitDisplay('length')})</span></th>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <div className="c-di-surveys-body">
          <div className="c-di-surveys-body-inner">
            <table>
              <tbody>
                {
                	data.map( (t,index)=> {
                    return (
                    <tr key={index}>
                      <td style={this.getCellStyle()}>{numeral(this.props.convert.convertValue(t.get("measured_depth"), 'length', 'ft')).format('0,0.0')}</td>
                      <td style={this.getCellStyle()}>{t.get("inclination").fixFloat(2)}</td>
                      <td style={this.getCellStyle()}>{t.get("azimuth").fixFloat(2)}</td>
                      <td style={this.getCellStyle()}>{t.get("dls").fixFloat(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>  
        </div>
      </div>
    );
  }

  getCellStyle() {
    return {
      width: '25%'
    };
  }
}

SurveysApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SurveysApp;
