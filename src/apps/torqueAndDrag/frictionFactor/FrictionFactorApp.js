import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { METADATA,SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import * as api from '../../../api';

import './FrictionFactorApp.css';

class FrictionFactorApp extends Component {

  render() {
    return (
      <div className="c-tnd-friction-factor">
        {this.getData() ?
          <div className="c-tnd-friction-factor__factor-box">
            {this.renderFactor('Casing', 'casing')}
            {this.renderFactor('Open Hole Slackoff', 'open_hole_slackoff')}
            {this.renderFactor('Open Hole Pickup', 'open_hole_pickup')}
          </div> :
          <LoadingIndicator />}
      </div>
    );
  }

  renderFactor(label, fieldName) {
    let current = this.getData().getIn(['data', 'current_usage', fieldName]) || 0;
    let predicted = this.getData().getIn(['data', 'predicted', fieldName]) || 0;
    return <Row className="c-tnd-friction-factor__factor">
      <Col s={5} className="c-tnd-friction-factor__label">
        <label>{label}</label>
      </Col>
      <Col s={3}>
        <input type="number" className="c-tnd-friction-factor__input"
               defaultValue={current.formatNumeral("0.00")}/>
      </Col>
      <Col s={4} className="c-tnd-friction-factor__predicted">
        *predicted {predicted.formatNumeral("0.00")}
      </Col>
    </Row>;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.data && !nextProps.data.equals(this.props.data)) {      
      this.saveRecord(subscriptions.selectors.firstSubData(nextProps.data, SUBSCRIPTIONS));
    }
    
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates))
    );
  }

  async saveRecord(subscriptionRecord) {
    const records = await api.getAppStorage(
        METADATA.recordProvider, 
        METADATA.recordCollection,this.props.asset.get('id'),  
        Map({
          limit: 1,
          sort: '{timestamp: -1}'
    }));    

    let record = Map({
      asset_id: this.props.asset.get('id'),
      data: subscriptionRecord.get('data'),
      timestamp: subscriptionRecord.get('timestamp'),
    });
    
    if (typeof(records.get(0)) !== "undefined") {
      const recentApiRecord = records.get(0);          
      var difference = subscriptionRecord.get('timestamp') - recentApiRecord.get('timestamp'); 
      var minutesDifference = Math.floor(difference/1000/60);        
      if (minutesDifference < 10 ) {                
        record = record.set('_id', recentApiRecord.get('_id'));        
      }      
    }  
   
    try {
      record.has('_id')? 
        await api.putAppStorage(METADATA.recordProvider, METADATA.recordCollection, record.get('_id') , record) :
        await api.postAppStorage(METADATA.recordProvider, METADATA.recordCollection, record);
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
