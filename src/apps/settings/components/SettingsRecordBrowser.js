import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Convert from '../../../common/Convert';

import './SettingsRecordBrowser.css';
class SettingsRecordBrowser extends Component {

  render() {    

    return <div className="c-settings-record-browser">      
      <Row className="c-settings-record-browser__filter">
        <Input m={11}                
               type="select"
               key={this.props.displayingRecord? this.props.displayingRecord.get('_id'): ''}
               defaultValue={this.props.displayingRecord? this.props.displayingRecord.get('_id'): ''}
               onChange={evt => this.onSelectChange(evt.target.value)}>
            {this.props.records.map(r =>
              <option key={r.get('_id')} value={r.get('_id')}>
                {this.props.renderRecordListItem(r)}
              </option>
            )}
        </Input>
        <Col m={1}>
          <Button floating icon="add" onClick={() => this.props.onNewRecord()} />
        </Col>
      </Row>

      {this.props.records.size<1 &&
        <div className="c-settings-record-browser__no-data">            
          <div>No Existing Data</div>
          <div className="c-settings-record-browser__no-data-description">Create a new one to begin</div>
        </div> }
      {this.props.records.size>0 && this.props.displayingRecord &&
        <div>
          <this.props.RecordSummary
            record={this.props.displayingRecord}
            convert={this.props.convert}
            isReadOnly={false}
            onEditRecord={this.props.onEditRecord}
            onDeleteRecord={this.props.onDeleteRecord} />
          <this.props.RecordDetails
            record={this.props.displayingRecord}
            convert={this.props.convert}
            isEditable={false} 
            onEditRecord={this.props.onEditRecord}
            onDeleteRecord={this.props.onDeleteRecord}/>
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
  onDeleteRecord: PropTypes.func.isRequired,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
};

export default SettingsRecordBrowser;