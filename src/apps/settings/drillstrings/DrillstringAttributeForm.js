import React, { Component, PropTypes } from 'react';
import { Row, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';


class DrillstringAttributeForm extends Component {

  render() {
    return <div>
      <Row key="attributes1" className="c-drillstring-editor__attributes">
        <Input
          m={4}
          label="Drillstring/BHA Number"
          required
          type="number"
          min="1"
          step="1"
          defaultValue={this.getAttr('id', '')}
          onChange={e => this.updateAttr('id', parseInt(e.target.value, 10))} />
        <Input
          m={4}
          type="checkbox"
          label="Is for Planning?"
          checked={this.getAttr('planning', false)}
          onChange={e => this.updateAttr('planning', e.target.checked)} />
      </Row>
      <Row key="attributes2" className="c-drillstring-editor__attributes">
        <Input
          label="Depth In"
          m={4}
          type="number"
          defaultValue={this.getAttr('start_depth', 0)}
          onChange={e => this.updateAttr('start_depth', parseFloat(e.target.value))} />
        <Input
          m={4}
          label="Depth Out"
          type="number"
          defaultValue={this.getAttr('end_depth', 0)}
          onChange={e => this.updateAttr('end_depth', parseFloat(e.target.value))} />
      </Row>
      <Row key="attributes3" className="c-drillstring-editor__attributes">
        <Input
          m={4}
          label="Time In"
          type="number"
          defaultValue={this.getAttr('start_timestamp', 0)}
          onChange={e => this.updateAttr('start_timestamp', parseInt(e.target.value, 10))} />
        <Input
          m={4}
          label="Time Out"
          type="text"
          defaultValue={this.getAttr('end_timestamp', 0)}
          onChange={e => this.updateAttr('end_timestamp', parseInt(e.target.value, 10))} />
      </Row>
    </div>;
  }

  getAttr(name, notSetValue) {
    return this.props.record.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value) {
    this.props.onUpdateRecord(this.props.record.setIn(['data', name], value));
  }

}

DrillstringAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export default DrillstringAttributeForm;