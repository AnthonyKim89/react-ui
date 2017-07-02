import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NotificationSystem from 'react-notification-system';
import LoadingIndicator from '../../../common/LoadingIndicator';

import * as api from '../../../api';

import {METADATA} from './constants';
import FormationsSummary from './FormationsSummary';
import FormationsItem from './FormationsItem';

import './FormationsApp.css';

class FormationsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: List(),
      preRecords: List(),
      loading: true
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
      records: records.sortBy(r=>r.get("timestamp")),
      loading: false
    });
  }

  render() {
    return (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="c-formations">
        <h4>{METADATA.title}</h4>
        <div>{METADATA.subtitle}</div>
        <FormationsSummary
          records={this.state.records} 
          onAdd={()=>this.add()}/>

        {(this.state.records.size > 0 || this.state.preRecords.size > 0)?
          <Table className="c-formations__formations-table">
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn className="c-formations__tvd-column"> True Vertical Depth({this.props.convert.getUnitDisplay('length')}) </TableHeaderColumn>
                <TableHeaderColumn className="c-formations__md-column hide-on-med-and-down"> Measured Depth({this.props.convert.getUnitDisplay('length')}) </TableHeaderColumn>
                <TableHeaderColumn className="c-formations__fm-column"> Formation Name </TableHeaderColumn>
                <TableHeaderColumn className="c-formations__lithology-column hide-on-med-and-down"> Lithology</TableHeaderColumn>
                <TableHeaderColumn className="c-formations__action-column hide-on-med-and-down"> </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody stripedRows={true}>
              {this.state.records.map(record=> {
                return <FormationsItem
                          key={record.get("_id")} 
                          record={record}
                          convert={this.props.convert}
                          onSave={(record)=>this.saveRecord(record)} 
                          onRemove={(record)=>this.removeRecord(record)}/>;
              })}

              {this.state.preRecords.map((record)=> {
                return <FormationsItem 
                  key={record.get("_pre_id")}
                  record={record}
                  convert={this.props.convert}
                  onSave={(record,continuousAdd)=>this.saveRecord(record,continuousAdd)}
                  onCancel={(preRecord)=>this.cancelAdd(preRecord)} />;
              })}
            </TableBody>
          </Table> :  
          this.renderNoRecords()
        }
          <FloatingActionButton className="c-costs__btn-add" onClick={(e)=>{this.add();}}>
            <ContentAdd />
          </FloatingActionButton>
            
          <a ref="scrollHelperAnchor"></a>
        <NotificationSystem ref="notificationSystem" noAnimation={true} />
      </div>
    </MuiThemeProvider>
    );
  }

  renderNoRecords() {
    if(this.state.loading) {
      return <div className="c-formations__loading">
              <div>Loading records...</div>
              <LoadingIndicator fullscreen={false} />
            </div>;
    }
    else {
      return <div className="c-formations__no-data">            
            <div>No Existing Formations</div>
            <div className="c-formations__no-data-description">Create a new one to begin</div>
          </div>;
    }
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

  async saveRecord(record,continuousAdd) {
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

    if (continuousAdd) {
      this.add();
    }
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

FormationsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default FormationsApp;
