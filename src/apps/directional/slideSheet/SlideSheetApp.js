import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

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

    let data;
    if (this.props.maximize) {
      data = json.getIn(["data","intervals"]);
    }
    else {
      data = json.getIn(["data","intervals"]).slice(0,5);
    }

    return (
      <div className="c-di-slidesheet">
        <div className="gaps"></div>    
        <table>
          <thead>
            <tr>
              <th>Depth <span>({this.props.convert.getUnitDisplay('length')})</span></th>
              <th>Length <span>({this.props.convert.getUnitDisplay('length')})</span></th>              
              <th>Inc <span>(°)</span></th>
              <th>Azi <span>(°)</span></th>
              <th>DLS <span>(°/{this.props.convert.convertValue(100, 'length', 'ft').fixFloat(1)}{this.props.convert.getUnitDisplay('length')})</span></th>
            </tr>
          </thead>
          <tbody>
            { data.map( (t,index)=> {
              return (
              <tr key={index}>
                <td>{numeral(this.props.convert.convertValue(t.get("measured_depth"), 'length', 'ft')).format('0,0.0')}</td>
                <td>{this.props.convert.convertValue(t.get("length"), 'length', 'ft').fixFloat(1)}</td>
                <td>{t.get("inclination").fixFloat(2)}</td>
                <td>{t.get("azimuth").fixFloat(2)}</td>
                <td>{t.get("dls").fixFloat(2)}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

SlideSheetApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SlideSheetApp;
