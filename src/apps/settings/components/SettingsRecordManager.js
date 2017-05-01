import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import SettingsRecordBrowser from './SettingsRecordBrowser';
import SettingsRecordEditor from './SettingsRecordEditor';
import Convert from '../../../common/Convert';

import './SettingsRecordManager.css';

/**
 * A reusable component for different settings apps that want to provide a "record manager interface"
 * - A listing of records
 * - Detail view of each record.
 * - Editor view of each record.
 * - Adding and deleting records
 */
class SettingsRecordManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      records: List(),
      displayingRecord: null,
      editingRecord: null
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
    const records = await api.getAppStorage(this.props.recordProvider, this.props.recordCollection, asset.get('id'), Map({limit: 0}));
    this.setState({
      records,
      displayingRecord: records.first()
    });
  }

  render() {
    return <div className="c-settings-record-manager">
      <h4>{this.props.title}</h4>
      <div>{this.props.subtitle}</div>
      {this.state.editingRecord ?
        <SettingsRecordEditor
          convert={this.props.convert}
          recordNameSingular={this.props.recordNameSingular}
          RecordAttributeForm={this.props.RecordAttributeForm}
          RecordSummary={this.props.hideRecordSummaryInRecordEditor? null: this.props.RecordSummary}
          RecordDetails={this.props.RecordDetails}
          record={this.state.editingRecord}
          recordValidator={this.props.recordValidator}
          preSaveHandler={this.props.preSaveHandler}
          isProcessing={this.props.isProcessing}
          convertRecordBackToImperialUnit={this.props.convertRecordBackToImperialUnit}
          onSave={record => this.saveRecord(record)}
          onCancel={() => this.setState({editingRecord: null})}
          onDeleteRecord={() => this.deleteRecord()} /> :
        <SettingsRecordBrowser
          convert={this.props.convert}
          recordNamePlural={this.props.recordNamePlural}
          recordNameSingular={this.props.recordNameSingular}
          RecordSummary={this.props.RecordSummary}          
          RecordDetails={this.props.RecordDetails}
          renderRecordListItem={this.props.renderRecordListItem}
          records={this.state.records}
          displayingRecord={this.state.displayingRecord}
          onSelectRecord={ds => this.setState({displayingRecord: ds})}
          onNewRecord={() => this.setState({editingRecord: this.makeNewRecord()})}
          onEditRecord={() => this.setState({editingRecord: this.state.displayingRecord})}
          onDeleteRecord={() => this.deleteRecord()} />}
    </div>;
  }

  makeNewRecord() {
    return Map({
      asset_id: this.props.asset.get('id'),
      data: this.props.recordDataTemplate
    });
  }

  async saveRecord(record) {
    this.setState({editingRecord: null});
    const savedRecord = record.has('_id') ?
      await api.putAppStorage(this.props.recordProvider, this.props.recordCollection, record.get('_id'), record) :
      await api.postAppStorage(this.props.recordProvider, this.props.recordCollection, record);
    this.setState({
      records: this.state.records.filterNot(r => r.get('_id') === savedRecord.get('_id'))
                                 .push(savedRecord)
                                 .sortBy(r => r.get('_id')),
      displayingRecord: savedRecord
    });
  }

  async deleteRecord() {
    const record = this.state.editingRecord || this.state.displayingRecord;
    await api.deleteAppStorage(this.props.recordProvider, this.props.recordCollection, record.get('_id'));
    const recordsAfterDelete = this.state.records
      .filterNot(r => r.get('_id') === record.get('_id'));
    this.setState({
      records: recordsAfterDelete,
      editingRecord: null,
      displayingRecord: recordsAfterDelete.first()
    });
  }

}

SettingsRecordManager.propTypes = {
  asset: ImmutablePropTypes.map,
  recordProvider: PropTypes.string.isRequired,
  recordCollection: PropTypes.string.isRequired,
  recordNamePlural: PropTypes.string.isRequired,
  recordNameSingular: PropTypes.string.isRequired,
  recordDataTemplate: ImmutablePropTypes.map.isRequired,
  RecordSummary: PropTypes.func.isRequired,
  RecordAttributeForm: PropTypes.func.isRequired,
  RecordDetails: PropTypes.func.isRequired,
  renderRecordListItem: PropTypes.func.isRequired,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
};


export default SettingsRecordManager;
