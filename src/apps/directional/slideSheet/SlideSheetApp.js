import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import * as api from '../../../api';
import LoadingIndicator from '../../../common/LoadingIndicator';
import {METADATA} from './constants';
import './SlideSheetApp.css';

import fakeData from './temp.json';

class SlideSheetApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.getData();      
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if ( (!this.props.asset && nextProps.asset) || (this.props.asset && nextProps.asset && (this.props.asset.get("id") !== nextProps.asset.get("id")))) {
      this.getData(nextProps.asset);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
        
    return  (
              this.state.data !== nextState.data ||              
              nextProps.coordinates !== this.props.coordinate
            );
  }

  render() {    
    if (!this.state.data) {
      return (
        <LoadingIndicator/>
      );
    }

    let data = this.state.data.slice(0,15);
    if (this.props.maximize) {
      data = this.state.data;
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
                    <td style={this.getCellStyle()}>{this.props.convert.convertValue(t.getIn(["data","hole_depth"]), 'length', 'ft').formatNumeral('0,0.0')}</td>
                    <td style={this.getCellStyle()}>{this.props.convert.convertValue(t.getIn(["data","hole_depth_change"]), 'length', 'ft').formatNumeral('0,0.0')}</td>
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

  async getData(asset=this.props.asset) {
    let data = await api.getAppStorage(METADATA.provider, METADATA.collection, asset.get('id'), Map({
      query: '{data.activity_name#eq#"Drilling Slide"}AND{data.hole_depth_change#gte#1}',
      sort: '{data.hole_depth:-1}'
    }));

    //data = this.getFakeData();
    this.setState({data});
  }

  getFakeData() {
    return fromJS(fakeData);
  }
  
  getCellStyle() {
    return {
      width: '50%'
    };
  }
}

SlideSheetApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default SlideSheetApp;
