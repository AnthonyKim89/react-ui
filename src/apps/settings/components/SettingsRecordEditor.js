import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Convert from '../../../common/Convert';

import './SettingsRecordEditor.css';

class SettingsRecordEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {record: props.record,errors:{}};
  }

  render() {
    return <div className="c-settings-record-editor">
      {this.renderAttributeForm()}
      {this.renderSummary()}
      {this.renderRecordDetails()}
      {this.renderActions()}
    </div>;
  }

  renderAttributeForm() {
    return <this.props.RecordAttributeForm              
              record={this.state.record}
              errors={this.state.errors}
              convert={this.props.convert}
              onSave={this.saveRecord.bind(this)}
              onUpdateRecord={r => this.updateRecord(r)} />;
  }

  renderSummary() {
    if (!this.props.RecordSummary) {
      return '';
    }

    return <Row>
      <Col m={12}>
        <this.props.RecordSummary
          record={this.state.record}
          convert={this.props.convert}
          isReadOnly={true}
          onDeleteRecord={this.props.onDeleteRecord} />
      </Col>
    </Row>;
  }

  renderRecordDetails() {
    return (
      <this.props.RecordDetails
        record={this.state.record}
        errors={this.state.errors}
        convert={this.props.convert}
        isEditable={true}
        onSave={this.saveRecord.bind(this)}
        onUpdateRecord={r => this.updateRecord(r)}/>
    );      
  }

  renderActions() {
    return (
      <div className="c-settings-record-editor__actions">      
        <Button onClick={() => this.saveRecord()}>
          Save
        </Button>
        <a onClick={() => this.props.onCancel()}>
          Cancel
        </a>
      </div>
    );
      
    
  }

  saveRecord() {
    if (this.props.recordValidator) {
      let errors = this.props.recordValidator(this.state.record);
      if (errors) {
        this.setState({errors:errors});
        return;        
      }      
    }

    if (this.props.preSaveHandler) {
      this.props.preSaveHandler(this.state.record, this.saveRecordAfterProcessing);
    }
    else {
      if (this.props.convertRecordBackToImperialUnit) {
        let convertedRecord = this.props.convertRecordBackToImperialUnit(this.state.record);
        this.props.onSave(convertedRecord);
      }
      else {      
        this.props.onSave(this.state.record);
      }
    }    
  }

  saveRecordAfterProcessing(data) {
    console.log(data.toJS());
    //this.props.onSave(postProcessingRecord);
  }

  updateRecord(record) {
    this.setState({record});
  }

}

SettingsRecordEditor.propTypes = {
  recordNameSingular: PropTypes.string.isRequired,
  RecordAttributeForm: PropTypes.func.isRequired,
  RecordDetails: PropTypes.func.isRequired,
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleteRecord: PropTypes.func.isRequired,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
};

export default SettingsRecordEditor;
