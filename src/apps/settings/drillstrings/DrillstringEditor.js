import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DrillstringComponentTable from './DrillstringComponentTable';
import DrillstringSummary from './DrillstringSummary';

import './DrillstringEditor.css';

class DrillstringEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {drillstring: props.drillstring};
  }

  render() {
    return <div className="c-drillstring-editor">
      {this.renderTitle()}
      {this.renderAttributeForm()}
      {this.renderSummary()}
      {this.renderComponentTable()}
      {this.renderActions()}
    </div>;
  }

  renderTitle() {
    if (this.props.drillstring.get('_id')) {
      return <Row><Col m={12}><h4>Edit Drillstring</h4></Col></Row>;
    } else {
      return <Row><Col m={12}><h4>Add New Drillstring</h4></Col></Row>;
    }
  }

  renderAttributeForm() {
    return [
      <Row key="attributes1" className="c-drillstring-editor__attributes">
        <Input
          m={4}
          label="Drillstring/BHA Number"
          required
          type="number"
          min="1"
          step="1"
          value={this.getAttr('id', '')}
          onChange={e => this.updateAttr('id', parseInt(e.target.value, 10))} />
        <Input
          m={4}
          type="checkbox"
          label="Is for Planning?"
          checked={this.getAttr('planning', false)}
          onChange={e => this.updateAttr('planning', e.target.checked)} />
      </Row>,
      <Row key="attributes2" className="c-drillstring-editor__attributes">
        <Input
          label="Depth In"
          m={4}
          type="number"
          value={this.getAttr('start_depth', 0)}
          onChange={e => this.updateAttr('start_depth', parseFloat(e.target.value))} />
        <Input
          m={4}
          label="Depth Out"
          type="number"
          value={this.getAttr('end_depth', 0)}
          onChange={e => this.updateAttr('end_depth', parseFloat(e.target.value))} />
      </Row>,
      <Row key="attributes3" className="c-drillstring-editor__attributes">
        <Input
          m={4}
          label="Time In"
          type="number"
          value={this.getAttr('start_timestamp', 0)}
          onChange={e => this.updateAttr('start_timestamp', parseInt(e.target.value, 10))} />
        <Input
          m={4}
          label="Time Out"
          type="text"
          value={this.getAttr('end_timestamp', 0)}
          onChange={e => this.updateAttr('end_timestamp', parseInt(e.target.value, 10))} />
      </Row>
    ];
  }

  renderSummary() {
    return <Row>
      <Col m={12}>
        <DrillstringSummary drillstring={this.state.drillstring} isReadOnly={true} />
      </Col>
    </Row>;
  }

  renderComponentTable() {
    return <Row>
      <Col m={12}>
        <DrillstringComponentTable
          drillstring={this.state.drillstring}
          isEditable={true}
          onAddComponent={() => this.addComponent()}
          onDeleteComponent={(...a) => this.deleteComponent(...a)}
          onComponentFieldChange={(...a) => this.updateComponentAttr(...a)}/>
      </Col>
    </Row>;
  }

  renderActions() {
    return <Row className="c_drillstring_editor__actions">
      <Col m={12}>
        <Button onClick={() => this.props.onSave(this.state.drillstring)}
                disabled={!this.isValid()}>
          Save
        </Button>
        or
        <Button onClick={() => this.props.onCancel()}>
          Cancel
        </Button>
      </Col>
    </Row>;
  }

  getAttr(name, notSetValue) {
    return this.state.drillstring.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value) {
    this.setState({
      drillstring: this.state.drillstring.setIn(['data', name], value)
    });
  }

  addComponent() {
    this.setState({
      drillstring: this.state.drillstring.updateIn(['data', 'components'], c => c.push(Map({})))
    });
  }

  deleteComponent(index) {
    this.setState({
      drillstring: this.state.drillstring.deleteIn(['data', 'components', index])
    });
  }

  updateComponentAttr(idx, name, value) {
    this.setState({
      drillstring: this.state.drillstring.setIn(['data', 'components', idx, name], value)
    });
  }

  isValid() {
    return this.getAttr('id');
  }

}

DrillstringEditor.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DrillstringEditor;