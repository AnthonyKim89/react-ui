import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SettingsRecordBrowser extends Component {

  render() {
    return <div className="c-settings-record-browser">
      <h4>{this.props.recordNamePlural}</h4>
      <Row>
        <Input m={11}
               label={this.props.recordNameSingular}
               type="select"
               onChange={evt => this.onSelectChange(evt.target.value)}>
            {this.props.records.map(r =>
              <option key={r.get('_id')} value={r.get('_id')}>
                {this.props.renderRecordListItem(r)}
              </option>
            )}
        </Input>
        <Col m={1}>
          <Button floating large icon="add" onClick={() => this.props.onNewRecord()} />
        </Col>
      </Row>
      {this.props.displayingRecord &&
        <div>
          <this.props.RecordSummary
            record={this.props.displayingRecord}
            isReadOnly={false}
            onEditRecord={this.props.onEditRecord}
            onDeleteRecord={this.props.onDeleteRecord} />
          <this.props.RecordDetails
            record={this.props.displayingRecord}
            isEditable={false} />
        </div>}
    </div>;
  }

  onSelectChange(id) {
    this.props.onSelectRecord(this.props.records.find(ds => ds.get('_id') === id));
  }
}

SettingsRecordBrowser.propTypes = {
  recordNamePlural: PropTypes.string.isRequired,
  recordNameSingular: PropTypes.string.isRequired,
  RecordSummary: PropTypes.func.isRequired,
  RecordDetails: PropTypes.func.isRequired,
  renderRecordListItem: PropTypes.func.isRequired,
  records: ImmutablePropTypes.list.isRequired,
  displayingRecord: ImmutablePropTypes.map,
  onSelectRecord: PropTypes.func.isRequired,
  onNewRecord: PropTypes.func.isRequired,
  onEditRecord: PropTypes.func.isRequired,
  onDeleteRecord: PropTypes.func.isRequired
};

export default SettingsRecordBrowser;