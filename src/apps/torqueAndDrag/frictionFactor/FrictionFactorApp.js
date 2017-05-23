import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NotificationSystem from 'react-notification-system';
import { Map } from 'immutable';
import { METADATA,SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import * as api from '../../../api';

import './FrictionFactorApp.css';

class FrictionFactorApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiRecordFetched: false,
      recentApiRecord: null
    };
  }

  componentDidMount() {        
    this._notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.asset && 
      ( (this.props.asset && this.props.asset.get("id") !== nextProps.asset.get("id")) || !this.props.asset)) {
      this.getApiData(nextProps.asset);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextState.apiRecordFetched !== this.state.apiRecordFetched)
    );
  }

  render() {
    return (
      <div className="c-tnd-friction-factor">
        {this.getData() && this.state.apiRecordFetched?
          <div className="c-tnd-friction-factor__factor-box">
            {this.renderFactor('Casing', 'casing')}
            {this.renderFactor('Open Hole Slackoff', 'open_hole_slackoff')}
            {this.renderFactor('Open Hole Pickup', 'open_hole_pickup')}
          </div> :
          <LoadingIndicator />}
        <NotificationSystem ref="notificationSystem" noAnimation={true} />
      </div>
    );
  }

  renderFactor(label, fieldName) {

    let current = this.getData().getIn(['data', 'current_usage', fieldName]) || 0;
    if (this.state.recentApiRecord) {
      let apiTimestamp = this.state.recentApiRecord.get("timestamp");
      let subscriptionTimestamp = this.getData().get("timestamp");
      if (apiTimestamp>subscriptionTimestamp) {
        current = this.state.recentApiRecord.getIn(["data",fieldName]);
      }
    }

    let predicted = this.getData().getIn(['data', 'predicted', fieldName]) || 0;

    return <Row className="c-tnd-friction-factor__factor">
      <Col s={5} className="c-tnd-friction-factor__label">
        <label>{label}</label>
      </Col>
      <Col s={3}>
        <input type="number" className="c-tnd-friction-factor__input"
               defaultValue={parseFloat(current).formatNumeral("0.00")}
               ref={fieldName} 
               onKeyPress={this.handleKeyPress.bind(this)}
               onBlur={this.handleBlur.bind(this)}/>
      </Col>
      <Col s={4} className="c-tnd-friction-factor__predicted">
        *predicted {predicted.formatNumeral("0.00")}
      </Col>
    </Row>;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  async getApiData(asset) {
    const records = await api.getAppStorage(        
      METADATA.recordProvider, 
      METADATA.recordCollection,asset.get('id'),  
      Map({
        limit: 1,
        sort: '{timestamp: -1}'
    }));

    if (typeof(records.get(0)) !== "undefined") {
      this.setState({
        apiRecordFetched: true,
        recentApiRecord: records.get(0)
      });
    }
    else {
      this.setState({        
        apiRecordFetched: true,
        recentApiRecord: null
      });
    }
  }



  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const inputData = this.getInputData();      
      if (!inputData) {
        this._notificationSystem.addNotification({
          message: 'All values should be between 0 and 1.',
          level: 'error'
        });
        return;
      }
      this.saveRecord(inputData);
    }
  }

  handleBlur() {
    const inputData = this.getInputData();
    if (!inputData) {
      this._notificationSystem.addNotification({
          message: 'Value should be 0~1',
          level: 'error'
        });
      return;      
    }
    this.saveRecord(inputData);
  }

  getInputData() {
    let casingValue = parseFloat(this.refs.casing.value);
    let slackoffValue = parseFloat(this.refs.open_hole_slackoff.value);
    let pickupValue = parseFloat(this.refs.open_hole_pickup.value);

    if (this.checkValidity(casingValue,0,1) &&  this.checkValidity(slackoffValue,0,1) && this.checkValidity(pickupValue,0,1)) {
      return Map({
        casing: casingValue,
        open_hole_slackoff: slackoffValue,
        open_hole_pickup: pickupValue
      });
    }

    return null;    
  }

  checkValidity(val,min,max) {
    if ( !isNaN(val) && val < max && val > min) {
      return true;
    }
    return false;
  }

  async saveRecord(inputData) {        
    const records = await api.getAppStorage(        
      METADATA.recordProvider, 
      METADATA.recordCollection,this.props.asset.get('id'),  
      Map({
        limit: 1,
        sort: '{timestamp: -1}'
    }));
    
    let record = Map({
      asset_id: this.props.asset.get('id'),
      data: inputData
    });

    if (typeof(records.get(0)) !== "undefined") {
      const recentApiRecord = records.get(0);
      let minutesDifference = (this.getData().get('timestamp') - recentApiRecord.get('timestamp')) / 1000 / 60;
      if (minutesDifference < 10 ) { //could it be minus???
        record = record.set('_id', recentApiRecord.get('_id'));        
      }      
    } 

    try {
      const isUpdate = record.has('_id');
      isUpdate ?
        await api.putAppStorage(METADATA.recordProvider, METADATA.recordCollection, record.get('_id') , record) :
        await api.postAppStorage(METADATA.recordProvider, METADATA.recordCollection, record);

      this._notificationSystem.addNotification({
        message: isUpdate? 'Updated successfully.': 'Created successfully.',
        level: 'success'
      });

    }
    catch(error) {
      console.log(error);     
    }
  }
  
}

FrictionFactorApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default FrictionFactorApp;
