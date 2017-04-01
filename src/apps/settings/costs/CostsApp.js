import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button } from 'react-materialize';
import NotificationSystem from 'react-notification-system';

import * as api from '../../../api';

import {METADATA} from './constants';
import CostsSummary from './CostsSummary';
import CostsItem from './CostsItem';

import './CostsApp.css';

class CostsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: List(),
      preRecords: List()
    };
  }
  
  componentDidMount() {
    if (this.props.asset) {
      this.loadRecords(this.props.asset);
    }
    this._notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadRecords(newProps.asset);
    }
  }

  async loadRecords(asset) {
    const records = await api.getAppStorage(METADATA.recordDevKey, METADATA.recordCollection, asset.get('id'), Map({limit: 0}));
    this.setState({
      records: records.sortBy(r=>r.get("timestamp"))
    });
  }

  render() {
    return (
      <div className="c-costs">
        <h4>{METADATA.title}</h4>
        <div>{METADATA.subtitle}</div>
        <CostsSummary 
          records={this.state.records} 
          onAdd={()=>this.add()}/>

        {this.state.records?
          <table className="c-costs__costs-table">
            <thead>
              <tr>
                <th> Date </th>
                <th> Cost </th>
                <th className="hide-on-med-and-down"> Description </th>
                <th className="hide-on-med-and-down"> </th>
              </tr>
            </thead>
            <tbody>
              {this.state.records.map(record=> {
                return <CostsItem 
                          key={record.get("_id")} 
                          record={record} 
                          onSave={(record)=>this.saveRecord(record)} 
                          onRemove={(record)=>this.removeRecord(record)}/>;
              })}

              {this.state.preRecords.map((record)=> {
                return <CostsItem 
                  key={record.get("_pre_id")}
                  record={record}
                  onSave={(record)=>this.saveRecord(record)}
                  onCancel={(preRecord)=>this.cancelAdd(preRecord)} />;
              })}
            </tbody>
          </table> : '' }
          <Button floating large className='lightblue' style={{marginTop:10}} waves='light' icon='add'  onClick={(e)=>{this.add();}} />
          
          <a ref="scrollHelperAnchor"></a>
        <NotificationSystem ref="notificationSystem" noAnimation={true} />
      </div>
    );
  }

  add() {        
    const record = Map({
      asset_id: this.props.asset.get('id'),
      _pre_id: new Date().getTime(),
      data: Map({})
    });

    this.setState({
      preRecords: this.state.preRecords.push(record)
    });

    setTimeout(()=>{
      ReactDOM.findDOMNode(this.refs.scrollHelperAnchor).scrollIntoView({behavior: "smooth"});
    },0);
    
  }

  cancelAdd(preRecord) {
    this.setState({
      preRecords: this.state.preRecords.filterNot(r => r.get('_pre_id') === preRecord.get('_pre_id'))
    });
  }

  async saveRecord(record) {
    
    let savedRecord;

    try {
      savedRecord = record.has('_id')? 
        await api.putAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record.get('_id') , record) :
        await api.postAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record);      
    }
    catch(error) {
      this._notificationSystem.addNotification({
        message: 'Error when creating a record.',
        level: 'error'
      });
    }

    if (!savedRecord) {
      return;
    }

    let index = this.state.records.findIndex(r=>r.get("_id")===savedRecord.get("_id"));
      
    if (index!==-1) { //update record
      this.setState({
        records: this.state.records.delete(index).insert(index,savedRecord)});
    }
    else { //create record id        
      let recordsAfterSave = this.state.records.push(savedRecord);
      let preRecordsAfterSave = this.state.preRecords.filterNot(r => r.get('_pre_id') === record.get('_pre_id'));
      this.setState({
        records: recordsAfterSave,
        preRecords: preRecordsAfterSave
      });
    }

    this._notificationSystem.addNotification({
      message: 'The record has been saved successfully.',
      level: 'success'
    });

  }

  async removeRecord(record) {

    try {      
      await api.deleteAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record.get('_id'));            
    }
    catch(error) {
      this._notificationSystem.addNotification({
        message: 'Error when deleting a record.',
        level: 'error'
      });
      return;
    }

    const recordsAfterDelete = this.state.records.filterNot(r => r.get('_id') === record.get('_id'));

    this.setState({
      records: recordsAfterDelete,
    });

    this._notificationSystem.addNotification({
      message: 'The record has been deleted successfully.',
      level: 'success'
    });
    
  }
}

CostsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default CostsApp;
