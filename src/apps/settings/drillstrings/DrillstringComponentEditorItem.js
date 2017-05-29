import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import { COMPONENT_FAMILIES, COMPONENT_GRADES, COMPONENT_MATERIALS, COMPONENT_CATALOGUE } from './constants';

import './DrillstringComponentEditorItem.css';

class DrillstringComponentEditorItem extends Component {
  render() {
    console.log(this.props.component.get('family'));
    return <div className="c-drillstring-component-editor-item">
      {this.renderComponent()}        
    </div>;
  }

  renderComponent() {
    switch(this.props.component.get("family")) {
      case 'dp':
        return this.renderComponentDP();
      case 'hwdp':
        return this.renderComponentHWDP();
      case 'pdm':
        return this.renderComponentPDM();
      case 'bit':
        return this.renderComponentBIT();
      default:
        return 'aaaa';
    }
  }

  renderComponentDP() {
    return [      
      <Row key="dp-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentTextField("outer_diameter","OD",1)}
        {this.renderComponentTextField("inner_diameter", "ID",1)}
        {this.renderComponentTextField("number_of_joint", "# of Joints", 1)}
        {this.renderComponentTextField("length", "Component Length", 1)}
        {this.renderComponentTextField("total_length", "Total Length", 1)}
        {this.renderComponentTextField("adjust_linear_weight", "Adjust Linear Weight", 2)}
        {this.renderComponentTextField("total_weight", "Total Weight", 1)}
        {this.renderComponentSelectField('grade', 1, COMPONENT_GRADES)}
      </Row>,

        
      <Row key="dp-2">
        {this.renderComponentTextField("tool_joint_od", "TJ OD", 1)}
        {this.renderComponentTextField("tool_joint_id", "TJ ID", 1)}
        {this.renderComponentTextField("tool_joint_length", "TJ Length per Joint", 2)}        
        {this.renderComponentTextField("norminal_linear_weigth", "Norminal Linear Weight", 2)}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', 2, COMPONENT_MATERIALS)}
        {this.renderComponentTextField("class", "Class", 2)}
      </Row>     
    ];    
  }

  renderComponentHWDP() {
    return [
      <Row key="hwdp-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentSelectField('sub-category', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("outer_diameter","OD",1)}
        {this.renderComponentTextField("inner_diameter", "ID",1)}
        {this.renderComponentTextField("number_of_joint", "# of Joints", 1)}
        {this.renderComponentTextField("length", "Component Length", 2)}
        {this.renderComponentTextField("total_length", "Total Length", 1)}
        {this.renderComponentTextField("adjust_linear_weight", "Adjust Linear Weight", 2)}
      </Row>,

      <Row key="hwdp-2">
        {this.renderComponentTextField("tool_joint_od", "TJ OD", 1)}
        {this.renderComponentTextField("tool_joint_id", "TJ ID", 1)}
        {this.renderComponentTextField("tool_joint_length", "TJ Length per Joint", 2)}        
        {this.renderComponentTextField("norminal_linear_weigth", "Norminal Linear Weight", 2)}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', 2, COMPONENT_MATERIALS)}
        {this.renderComponentTextField("class", "Class", 2)}
      </Row>   
    ]
    
  }

  renderComponentPDM() {
    return [
      <Row key="pdm">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentTextField("outer_diameter","OD",1)}
        {this.renderComponentTextField("inner_diameter", "ID",1)}
        {this.renderComponentTextField("length", "Component Length", 2)}
        {this.renderComponentTextField("adjust_linear_weight", "Adjust Linear Weight", 2)}
        {this.renderComponentTextField("total_weight", "Total Weight", 2)}
        {this.renderComponentSelectField('info', 1, COMPONENT_CATALOGUE)}    
      </Row>,
      <Row key={`motor-${this.props.index}-title`}>
        <Col m={2}></Col>
        <Col m={10}>
          <h5>Motor: {this.props.component.get('name')}</h5>
        </Col>
      </Row>,
      <Row key={`motor-${this.props.index}-fields`}>
        <Col m={2}></Col>
        {this.renderHighlightNumberField(this.props.component, this.props.index, 'number_rotor_lobes', '# of rotor lobes', 3)}
        {this.renderHighlightNumberField(this.props.component, this.props.index, 'number_stator_lobes', '# of stator lobes', 3)}
        {this.renderHighlightNumberField(this.props.component, this.props.index, 'rpg', 'RPG', 3)}
      </Row>
    ]
  }

  renderComponentBIT() {
    return [
      <Row key="pdm">
        {this.renderComponentSelectField('family', 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentTextField("outer_diameter","OD",2)}        
        {this.renderComponentTextField("length", "Component Length", 2)}
        {this.renderComponentTextField("weight", "Weight", 2)}        
      </Row>,
      <Row>
        {this.renderComponentTextField("shank_od", "Shank OD", 2)}
        {this.renderComponentTextField("make", "Make", 2)}
        {this.renderComponentTextField("serial_number", "Serrial Number", 2)}
        {this.renderComponentTextField("model", "Model", 2)}
        {this.renderComponentTextField("tfa", "TFA", 2)}     
      </Row>
      
    ]
  }

  renderComponentTextField(field, label="", colSize=2) {
    if (this.props.isEditable) {
      return <Input type="text"
                    label={label}
                    m={colSize}
                    s={12}
                    key={field}
                    value={this.props.component.get(field, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)} />;
    } else {
      return this.props.component.get(field);
    }
  }

  renderComponentSelectField(field, colSize=2, options) {
    if (this.props.isEditable) {
      return <Input type="select"
                    m={colSize}
                    s={12}
                    value={this.props.component.get(field, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)}>
        {options.map(({name, type}) =>
          <option key={type} value={type}>{name}</option>)}
      </Input>;
    } else {
      return this.props.component.get(field);
    }
  }

  renderHighlightNumberField(component, idx, field, label, cols, unitType,unit) {
    let errors = this.props.errors;
    let value = component.get(field, '');
    if (value!=='' && unitType && unit) {        
      value = this.props.convert.convertValue(value,unitType,unit).formatNumeral('0.0');
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
        <div className="c-drillstring-component-highlight-text-label">{label}</div>
        <div>{value || "-"}</div>
      </Col>;
    }
  }

  handleKeyPress() {

  }

}

DrillstringComponentEditorItem.propTypes = {
  index: PropTypes.number.isRequired,
  component: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onComponentFieldChange: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

export default DrillstringComponentEditorItem;