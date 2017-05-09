import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './SlideSheetApp.css';

class SlideSheetApp extends Component {
  render() {
    let json = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS);
    if (!json) {
      return (        
        <LoadingIndicator/>        
      );
    }

    let data = json.getIn(["data","intervals"]).slice(0,5);
    if (this.props.maximize) {
      data = json.getIn(["data","intervals"]);
    }

    return (
      <div className="c-di-slidesheet">
        
        <div className="c-di-slidesheet-head">
          <div className="c-di-slidesheet-head-inner">
            <table>
              <thead>
                <tr>
                  <th style={this.getCellStyle()}>Depth <span>({this.props.convert.getUnitDisplay('length')})</span></th>
                  <th style={this.getCellStyle()}>Length <span>({this.props.convert.getUnitDisplay('length')})</span></th>              
                  <th style={this.getCellStyle()}>Inc <span>(°)</span></th>
                  <th style={this.getCellStyle()}>Azi <span>(°)</span></th>
                  <th style={this.getCellStyle()}>DLS <span>(°/{this.props.convert.convertValue(100, 'length', 'ft').fixFloat(1)}{this.props.convert.getUnitDisplay('length')})</span></th>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <div className="c-di-slidesheet-body">
          <div className="c-di-slidesheet-body-inner">
            <table>
              <tbody>
                { data.map( (t,index)=> {
                  return (
                  <tr key={index}>
                    <td style={this.getCellStyle()}>{this.props.convert.convertValue(t.get("measured_depth"), 'length', 'ft').formatNumeral('0,0.0')}</td>
                    <td style={this.getCellStyle()}>{this.props.convert.convertValue(t.get("length"), 'length', 'ft').fixFloat(1)}</td>
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

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || !nextProps.coordinates.equals(this.props.coordinates));
  }

  getCellStyle() {
    return {
      width: '20%'
    };
  }
}

SlideSheetApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SlideSheetApp;
