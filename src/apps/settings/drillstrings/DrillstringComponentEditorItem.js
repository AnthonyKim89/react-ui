import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import { COMPONENT_FAMILIES, COMPONENT_GRADES, COMPONENT_MATERIALS, COMPONENT_CATALOGUES } from './constants';

import './DrillstringComponentEditorItem.css';

const HWDP_SUB_CATEGORIES = [
  {name: 'HWDP_SUB_1', type: 'hwdp_sub_1'},
  {name: 'HWDP_SUB_2', type: 'hwdp_sub_2'},
  {name: 'HWDP_SUB_3', type: 'hwdp_sub_3'},  
];

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
        {this.renderComponentSelectField('sub_category', 1, HWDP_SUB_CATEGORIES)}
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
      <Row key="pdm-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentTextField("outer_diameter","OD",1)}
        {this.renderComponentTextField("inner_diameter", "ID",1)}
        {this.renderComponentTextField("length", "Component Length", 2)}
        {this.renderComponentTextField("adjust_linear_weight", "Adjust Linear Weight", 2)}
        {this.renderComponentTextField("total_weight", "Total Weight", 2)}
        {this.renderComponentSelectField('info', 1, COMPONENT_CATALOGUES)}
      </Row>,
      
      <Row key="pdm-2">
        {this.renderComponentTextField('number_rotor_lobes', '# of rotor lobes',4)}
        {this.renderComponentTextField('number_stator_lobes', '# of stator lobes',4)}
        {this.renderComponentTextField('rpg', 'RPG',4)}
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