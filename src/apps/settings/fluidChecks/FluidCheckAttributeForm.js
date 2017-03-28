import React, { Component, PropTypes } from 'react';
import { Row, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';


class FluidCheckAttributeForm extends Component {

  render() {
    return <div>
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
      </Row>
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
    </div>;
  }

  getAttr(name, notSetValue) {
    return this.props.record.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value) {
    this.props.onUpdateRecord(this.props.record.setIn(['data', name], value));
  }

}

FluidCheckAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export default FluidCheckAttributeForm;
