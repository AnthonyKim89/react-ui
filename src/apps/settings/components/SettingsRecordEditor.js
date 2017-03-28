import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Convert from '../../../common/Convert';

import './SettingsRecordEditor.css';

class SettingsRecordEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {record: props.record};
  }

  render() {
    return <div className="c-settings-record-editor">
      {this.renderTitle()}
      {this.renderAttributeForm()}
      {this.renderSummary()}
      {this.renderRecordDetails()}
      {this.renderActions()}
    </div>;
  }

  renderTitle() {
    if (this.props.record.get('_id')) {
      return <Row><Col m={12}><h4>Edit {this.props.recordNameSingular}</h4></Col></Row>;
    } else {
      return <Row><Col m={12}><h4>Add {this.props.recordNameSingular}</h4></Col></Row>;
    }
  }

  renderAttributeForm() {
    return <this.props.RecordAttributeForm
              record={this.state.record}
              convert={this.props.convert}
              onUpdateRecord={r => this.updateRecord(r)} />;
  }

  renderSummary() {
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
    return <Row>
      <Col m={12}>
        <this.props.RecordDetails
          record={this.state.record}
          convert={this.props.convert}
          isEditable={true}
          onUpdateRecord={r => this.updateRecord(r)}/>
      </Col>
    </Row>;
  }

  renderActions() {
    return <Row className="c-settings-record-editor__actions">
      <Col m={12}>
        <Button onClick={() => this.props.onSave(this.state.record)}>
          Save
        </Button>
        &nbsp;or&nbsp;
        <a onClick={() => this.props.onCancel()}>
          Cancel
        </a>
      </Col>
    </Row>;
  }

  updateRecord(record) {
    this.setState({record});
  }

}

SettingsRecordEditor.propTypes = {
  recordNameSingular: PropTypes.string.isRequired,
  RecordAttributeForm: PropTypes.func.isRequired,
  RecordSummary: PropTypes.func.isRequired,
  RecordDetails: PropTypes.func.isRequired,
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleteRecord: PropTypes.func.isRequired,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
};

export default SettingsRecordEditor;
