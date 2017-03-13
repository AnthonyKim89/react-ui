import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FluidCheckRheometerReadings from './FluidCheckRheometerReadings';
import FluidCheckSummary from './FluidCheckSummary';

import './FluidChecksEditor.css';

class FluidChecksEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {fluidCheck: props.fluidCheck};
  }

  render() {
    return <div className="c-fluid-checks-editor">
      {this.renderTitle()}
      {this.renderAttributeForm()}
      {this.renderSummary()}
      {this.renderRheometerReadings()}
      {this.renderActions()}
    </div>;
  }

  renderTitle() {
    if (this.props.fluidCheck.get('_id')) {
      return <Row><Col m={12}><h4>Edit Fluid Check</h4></Col></Row>;
    } else {
      return <Row><Col m={12}><h4>Add New Fluid Check</h4></Col></Row>;
    }
  }

  renderAttributeForm() {
    return [
      <Row key="attributes1" className="c-fluid-checks-editor__attributes">
        <Input
          m={4}
          label="Density (ppg)"
          required
          type="number"
          min="1"
          defaultValue={this.getAttr('mud_density', '')}
          onChange={e => this.updateAttr('mud_density', parseInt(e.target.value, 10))} />
        <Input
          m={4}
          label="Funnel Viscosity (s)"
          required
          type="number"
          min="1"
          defaultValue={this.getAttr('plastic_viscosity', '')}
          onChange={e => this.updateAttr('plastic_viscosity', parseInt(e.target.value, 10))} />
      </Row>,
      <Row key="attributes2" className="c-drillstring-editor__attributes">
        <Input
          label="PV"
          m={4}
          type="number"
          defaultValue={this.getAttr('PV', 0)}
          onChange={e => this.updateAttr('PV', parseFloat(e.target.value))} />
        <Input
          m={4}
          label="YP"
          type="number"
          defaultValue={this.getAttr('YP', 0)}
          onChange={e => this.updateAttr('YP', parseFloat(e.target.value))} />
      </Row>
    ];
  }

  renderSummary() {
    return <Row>
      <Col m={12}>
        <FluidCheckSummary fluidCheck={this.state.fluidCheck}
                           isReadOnly={true}
                           onDeleteFluidCheck={this.props.onDeleteFluidCheck} />
      </Col>
    </Row>;
  }

  renderRheometerReadings() {
    return <Row>
      <Col m={12}>
        <FluidCheckRheometerReadings
          fluidCheck={this.state.fluidCheck}
          isEditable={true}
          onReadingChange={(...a) => this.updateRheometerReading(...a)}/>
      </Col>
    </Row>;
  }

  renderActions() {
    return <Row className="c-fluid-checks-editor__actions">
      <Col m={12}>
        <Button onClick={() => this.props.onSave(this.state.fluidCheck)}>
          Save
        </Button>
        &nbsp;or&nbsp;
        <a onClick={() => this.props.onCancel()}>
          Cancel
        </a>
      </Col>
    </Row>;
  }

  getAttr(name, notSetValue) {
    return this.state.fluidCheck.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value) {
    this.setState({
      fluidCheck: this.state.fluidCheck.setIn(['data', name], value)
    });
  }

  updateRheometerReading(name, value) {
    this.setState({
      fluidCheck: this.state.fluidCheck.setIn(['data', 'rheometer_readings', name], value)
    });
  }

}

FluidChecksEditor.propTypes = {
  fluidCheck: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleteFluidCheck: PropTypes.func.isRequired
};

export default FluidChecksEditor;
