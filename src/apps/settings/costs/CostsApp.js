import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';

import {METADATA} from './constants';
import CostsSummary from './CostsSummary';
import CostsAdd from './CostsAdd';
import CostsItem from './CostsItem';

import './CostsApp.css';

class CostsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: List(),
      currentRecord: null
    };
  }
  
  componentDidMount() {
    if (this.props.asset) {
      this.loadRecords(this.props.asset);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadRecords(newProps.asset);
    }
  }

  async loadRecords(asset) {
    const records = await api.getAppStorage(METADATA.recordDevKey, METADATA.recordCollection, asset.get('id'), Map({limit: 0}));
    const sortedRecords = records.sortBy(r => r.getIn(["data","date"]));
    this.setState({
      records: sortedRecords    
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
          <table className="responsive">
            <thead>
              <tr>
                <th> Date </th>
                <th> Cost </th>
                <th> Description </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {this.state.records.map(record=> {
                return <CostsItem key={record.get("_id")} record={record} onSave={(record)=>this.saveRecord(record)} onRemove={(record)=>this.removeRecord(record)}/>;
              })}
            </tbody>
          </table> : '' }

        {this.state.currentRecord?
          <CostsAdd
            record={this.state.currentRecord}
            onSave={(record)=>this.saveRecord(record)}
            onCancel={()=>this.cancelAdd()} /> : ''}
      </div>
    );
  }

  add() {
    const record = Map({
      asset_id: this.props.asset.get('id'),
      data: Map({})
    });
    this.setState({currentRecord: record});    
  }

  cancelAdd() {
    this.setState({currentRecord: null});
  }

  async saveRecord(record) {
    this.setState({currentRecord: null});
    
    const savedRecord = record.has('_id') ?
      await api.putAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record.get('_id') , record) :
      await api.postAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record);

    this.setState({
      records: this.state.records.filterNot(r => r.get('_id') === savedRecord.get('_id'))
                                 .push(savedRecord)
                                 .sortBy(r => r.getIn(["data","date"]))});
  }

  async removeRecord(record) {    
    try {
      await api.deleteAppStorage(METADATA.recordDevKey, METADATA.recordCollection, record.get('_id'));
      const recordsAfterDelete = this.state.records
        .filterNot(r => r.get('_id') === record.get('_id'));
      this.setState({
        records: recordsAfterDelete,
        currentRecord: null,      
      });
    }
    catch(error) {
      alert("Unable to delete the settings record.");
    }
        
  }
}

CostsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default CostsApp;
