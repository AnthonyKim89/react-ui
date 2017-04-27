import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV1 from 'uuid/v1';
import numeral from 'numeral';

import DrillstringComponentSchematic from './DrillstringComponentSchematic';
import DrillstringComponentTableRow from './DrillstringComponentTableRow';

import './DrillstringComponentTable.css';

class DrillstringComponentTable extends Component {

  render() {
    return <div className="c-drillstring-component-table">
      {this.props.isEditable && this.props.errors && this.props.errors["bit_count"] ?
        <div style={{color:'red'}}>
          { this.props.errors["bit_count"] }
        </div> : ''
      }
      <Row>
        <Col m={1}>
          <DrillstringComponentSchematic
            drillstring={this.props.record}
            isEditable={this.props.isEditable}
            onReorderComponents={this.onReorderComponents.bind(this)} />
        </Col>
        <Col m={11}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>ID ({this.props.convert.getUnitDisplay('shortLength')})</th>
                <th>OD ({this.props.convert.getUnitDisplay('shortLength')})</th>
                <th>Linear Weight ({this.props.convert.getUnitDisplay('force')}) </th>
                <th>Length ({this.props.convert.getUnitDisplay('length')})</th>
                <th>Weight ({this.props.convert.getUnitDisplay('mass')})</th>
                <th>Grade </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.props.record.getIn(['data', 'components'], List()).map((cmp, idx) => 
                <DrillstringComponentTableRow
                  convert={this.props.convert}
                  key={idx}
                  index={idx}
                  component={cmp}
                  errors={this.props.errors && this.props.errors["components"]? this.props.errors["components"][idx]: null}
                  isEditable={this.props.isEditable}
                  onSave={this.props.onSave}
                  onComponentFieldChange={(field, value) => this.onComponentFieldChange(idx, field, value)}
                  onComponentMultiFieldsChange={(nameValuePairs) => this.onComponentMultiFieldsChange(idx,nameValuePairs)}
                  onDeleteComponent={() => this.onDeleteComponent(idx)} />)}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col m={1}></Col>
        <Col m={10}>
          {this.props.isEditable &&
            <Button floating icon="add" onClick={() => this.onAddComponent()}></Button>}
        </Col>
      </Row>
      <div className="c-drillstring-component-specific-data">
        {this.getComponentsOfFamily('bit').flatMap(({component, index}) =>
          this.renderBitComponentHighlight(component, index))}
        {this.getComponentsOfFamily('pdm').flatMap(({component, index}) =>
          this.renderPDMComponentHighlight(component, index))}
        {this.getComponentsOfFamily('mwd').flatMap(({component, index}) =>
          this.renderMWDComponentHighlight(component, index))}
      </div>
    </div>;
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
        {this.renderHighlightNumberField(bit, idx, 'size', 'Size', 3,'shortLength','in')}
      </Row>
    ];
  }

  renderPDMComponentHighlight(motor, idx) {
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

  renderMWDComponentHighlight(pipe, idx) {
    return [
      <Row key={`drill-pipe-${idx}-title`}>
        <Col m={2}></Col>
        <Col m={10}>
          <h5>Drill pipe: {pipe.get('name')}</h5>
        </Col>
      </Row>,
      <Row key={`pipe-${idx}-fields`}>
        <Col m={2}></Col>
        {this.renderHighlightTextField(pipe, idx, 'sensor_to_bit_distance', 'Sensor to bit distance', 3)}
      </Row>
    ];
  }

  renderHighlightTextField(component, idx, field, label, cols) {
    if (this.props.isEditable) {
      return <Input m={cols}
                    type="text"
                    label={label}
                    defaultValue={component.get(field, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.onComponentFieldChange(idx, field, e.target.value)} />;
    } else {
      return <Col m={cols}>
        <div>{label}</div>
        <div>{component.get(field)}</div>
      </Col>;
    }
  }

  renderHighlightNumberField(component, idx, field, label, cols, unitType,unit) {
    let errors = this.props.errors;
    let value = component.get(field, '');
    if (value!=='' && unitType && unit) {        
      value = numeral(this.props.convert.convertValue(value,unitType,unit)).format('0.0');
    }
    if (this.props.isEditable) {
      return <Input m={cols}
                    type="number"
                    label={label}
                    error={errors && errors["specificErrors"] && errors["specificErrors"][component.get("id")]? errors["specificErrors"][component.get("id")][field]: null}
                    defaultValue={value}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.onComponentFieldChange(idx, field, parseFloat(e.target.value))} />;
    } else {
      return <Col m={cols}>
        <div>{label}</div>
        <div>{value}</div>
      </Col>;
    }
  }

  getComponentsOfFamily(family) {
    return this.props.record.getIn(['data', 'components'])
      .map((component, index) => ({component, index}))
      .filter(item => item.component.get('family') === family);
  }

  onAddComponent() {
    const newComponent = Map({
      id: uuidV1(),
      family: 'bit',
      order: this.props.record.getIn(['data', 'components']).size
    });
    this.props.onUpdateRecord(this.props.record.updateIn(['data', 'components'], c => c.push(newComponent)));
  }

  onDeleteComponent(index) {
    this.props.onUpdateRecord(this.props.record.deleteIn(['data', 'components', index]));
  }

  onComponentFieldChange(idx, name, value) {
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components', idx, name], value));
  }

  onComponentMultiFieldsChange(idx,nameValuePairs) {    
    let record = this.props.record;
    nameValuePairs.map(nameValue=> {
      let {name,value} = nameValue;
      record = record.setIn(['data','components',idx,name],value);
      return nameValue;
    });

    if (record) {
      this.props.onUpdateRecord(record);
    }    
  }

  onReorderComponents(newComponents) {
    const withNewIndexes = newComponents.map((comp, idx) => comp.set('order', idx));
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components'], withNewIndexes));
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {      
      this.props.onSave();
    }
  }

}

DrillstringComponentTable.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onUpdateRecord: PropTypes.func
};

export default DrillstringComponentTable;