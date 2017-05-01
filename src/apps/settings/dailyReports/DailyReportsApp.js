import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NotificationSystem from 'react-notification-system';

import * as api from '../../../api';

import {METADATA} from './constants';
import DailyReportsSummary from './DailyReportsSummary';
import DailyReportsItem from './DailyReportsItem';

import './DailyReportsApp.css';

class DailyReportsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: List(),
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
    const records = await api.getAppStorage(METADATA.recordProvider, METADATA.recordCollection, asset.get('id'), Map({limit: 0}));    
    this.setState({
      records: records.sortBy(r=>r.get("timestamp"))
    });
  }

  render() {

    if (!this.props.asset) {
      return null;
    }    

    const record = Map({
      asset_id: this.props.asset.get('id'),      
      data: Map({})
    });

    let startIndex = Math.max(this.state.records.size - 5, 0);
    const recentRecords = this.state.records.slice(startIndex).sort((a,b)=>{
      if (a.get('timestamp') > b.get('timestamp')) { return -1;}
      if (a.get('timestamp') < b.get('timestamp')) { return 1;}
      return 0;

    });

    return (
      <div className="c-daily-reports">
        <h4>{METADATA.title}</h4>
        <div>{METADATA.subtitle}</div>

        <DailyReportsSummary
          record={record}
          recentRecords={recentRecords}
          onSave={(record)=>this.saveRecord(record)}
        />

        {this.state.records?
          <table className="c-daily-reports__reports-table">
            <thead>
              <tr>
                <th className="c-daily-reports__file-header"> File Name </th>
                <th className="c-daily-reports__date-header"> Date </th>
                <th className="c-daily-reports__user-header hide-on-med-and-down"> User </th>
                <th className="c-daily-reports__action-header hide-on-med-and-down"> </th>
              </tr>
            </thead>
            <tbody>
              {this.state.records.map(record=> {
                return <DailyReportsItem
                          key={record.get("_id")} 
                          record={record} 
                          onRemove={(record)=>this.removeRecord(record)}/>;
              })}              
            </tbody>
          </table> : '' }

        <NotificationSystem ref="notificationSystem" noAnimation={true} />

      </div>      
    );
  }
  
  async saveRecord(record) {
    
    let savedRecord;

    try {
      savedRecord = record.has('_id')? 
        await api.putAppStorage(METADATA.recordProvider, METADATA.recordCollection, record.get('_id') , record) :
        await api.postAppStorage(METADATA.recordProvider, METADATA.recordCollection, record);
    }
    catch(error) {
      this._notificationSystem.addNotification({
        message: 'Error when saving a record.',
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
      this.setState({
        records: recordsAfterSave
      });
    }

    this._notificationSystem.addNotification({
      message: 'The record has been saved successfully.',
      level: 'success'
    });

  }

  async removeRecord(record) {
    try {      
      await api.deleteAppStorage(METADATA.recordProvider, METADATA.recordCollection, record.get('_id'));
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

DailyReportsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DailyReportsApp;
