import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { COMPONENT_FAMILIES } from './constants';
import DrillstringComponentSchematic from './DrillstringComponentSchematic';

import './DrillstringComponentTable.css';

class DrillstringComponentTable extends Component {

  render() {
    return <div className="c-drillstring-component-table">
      <Row>
        <Col m={2}>
          <DrillstringComponentSchematic
            drillstring={this.props.drillstring}
            isEditable={this.props.isEditable}
            onReorderComponents={this.props.onReorderComponents} />
        </Col>
        <Col m={10}>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Family</th>
                <th>ID (in)</th>
                <th>OD (in)</th>
                <th>Length (ft)</th>
                <th>Weight (lbs)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.props.drillstring.getIn(['data', 'components'], List()).map((cmp, idx) => 
                this.renderComponent(cmp, idx))}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col m={2}></Col>
        <Col m={10}>
          {this.props.isEditable &&
            <Button floating icon="add" onClick={() => this.props.onAddComponent()}></Button>}
        </Col>
      </Row>
      {this.getComponentsOfFamily('bit').flatMap(({component, index}) =>
        this.renderBitComponentHighlight(component, index))}
      {this.getComponentsOfFamily('motor').flatMap(({component, index}) =>
        this.renderMotorComponentHighlight(component, index))}
      {this.getComponentsOfFamily('drill_pipe').flatMap(({component, index}) =>
        this.renderDrillPipeComponentHighlight(component, index))}
    </div>;
  }

  renderComponent(component, idx) {
    return <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{this.renderComponentTextField(component, idx, 'name')}</td>
      <td>{this.renderComponentSelectField(component, idx, 'family', COMPONENT_FAMILIES)}</td>
      <td>{this.renderComponentNumberField(component, idx, 'inner_diameter')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'outer_diameter')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'length')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'linear_weight')}</td>
      <td>
        {this.props.isEditable &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteComponent(idx)}></Button>}
      </td>
    </tr>;
  }

  renderBitComponentHighlight(bit, idx) {
    return [
      <Row key={`bit-${idx}-title`}>
        <Col m={2}></Col>
        <Col m={10}>
          <h5>Bit: {bit.get('name')}</h5>
        </Col>
      </Row>,
      <Row key={`bit-${idx}-make`}>
        <Col m={2}></Col>
        {this.renderHighlightTextField(bit, idx, 'make', 'Make', 3)}
        {this.renderHighlightTextField(bit, idx, 'model', 'Model', 3)}
        {this.renderHighlightTextField(bit, idx, 'serial_number', 'Serial number', 3)}
      </Row>,
      <Row key={`bit-${idx}-fields`}>
        <Col m={2}></Col>
        {this.renderHighlightNumberField(bit, idx, 'bit_wear', 'Bit wear', 3)}
        {this.renderHighlightNumberField(bit, idx, 'tfa', 'TFA', 3)}
        {this.renderHighlightNumberField(bit, idx, 'size', 'Size', 3)}
      </Row>
    ];
  }

  renderMotorComponentHighlight(motor, idx) {
    return [
      <Row key={`motor-${idx}-title`}>
        <Col m={2}></Col>
        <Col m={10}>
          <h5>Motor: {motor.get('name')}</h5>
        </Col>
      </Row>,
      <Row key={`motor-${idx}-fields`}>
        <Col m={2}></Col>
        {this.renderHighlightNumberField(motor, idx, 'number_rotor_lobes', '# of rotor lobes', 3)}
        {this.renderHighlightNumberField(motor, idx, 'number_stator_lobes', '# of stator lobes', 3)}
        {this.renderHighlightNumberField(motor, idx, 'rpg', 'RPG', 3)}
      </Row>
    ];
  }

  renderDrillPipeComponentHighlight(pipe, idx) {
    return [
      <Row key={`drill-pipe-${idx}-title`}>
        <Col m={2}></Col>
        <Col m={10}>
          <h5>Drill pipe: {pipe.get('name')}</h5>
        </Col>
      </Row>,
      <Row key={`pipe-${idx}-fields`}>
        <Col m={2}></Col>
        {this.renderHighlightTextField(pipe, idx, 'grade', 'Grade', 3)}
      </Row>
    ];
  }

  renderComponentTextField(component, idx, field) {
    if (this.props.isEditable) {
      return <Input type="text"
                    value={component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(idx, field, e.target.value)} />
    } else {
      return component.get(field);
    }
  }

  renderComponentSelectField(component, idx, field, options) {
    if (this.props.isEditable) {
      return <Input type="select"
                    value={component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(idx, field, e.target.value)}>
        {options.map(({name, type}) =>
          <option key={type} value={type}>{name}</option>)}
      </Input>
    } else {
      return component.get(field);
    }
  }

  renderComponentNumberField(component, idx, field) {
    if (this.props.isEditable) {
      return <Input type="number"
                    value={component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(idx, field, parseFloat(e.target.value))} />
    } else {
      return component.get(field);
    }
  }

  renderHighlightTextField(component, idx, field, label, cols) {
    if (this.props.isEditable) {
      return <Input m={cols}
                    type="text"
                    label={label}
                    value={component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(idx, field, e.target.value)} />
    } else {
      return <Col m={cols}>
        <div>{label}</div>
        <div>{component.get(field)}</div>
      </Col>;
    }
  }

  renderHighlightNumberField(component, idx, field, label, cols) {
    if (this.props.isEditable) {
      return <Input m={cols}
                    type="number"
                    label={label}
                    value={component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(idx, field, parseFloat(e.target.value))} />
    } else {
      return <Col m={cols}>
        <div>{label}</div>
        <div>{component.get(field)}</div>
      </Col>;
    }
  }

  getComponentsOfFamily(family) {
    return this.props.drillstring.getIn(['data', 'components'])
      .map((component, index) => ({component, index}))
      .filter(item => item.component.get('family') === family);
  }

}

DrillstringComponentTable.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onAddComponent: PropTypes.func,
  onDeleteComponent: PropTypes.func,
  onComponentFieldChange: PropTypes.func,
  onReorderComponents: PropTypes.func
};

export default DrillstringComponentTable;