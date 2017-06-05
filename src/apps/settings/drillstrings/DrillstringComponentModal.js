import React, { Component } from 'react';
import { Row,Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringComponentBrowserItem.css';

class DrillstringComponentModal extends Component {

  render() {
    return <div className="c-drillstring-component-modal">
      <Row>
        <Col s={1}>
          {this.renderComponentImage()}
        </Col>
        <Col s={11}>
          {this.renderComponent()}
        </Col>
      </Row>      
    </div>;
  }

  renderComponentImage() {
    return <div className={`c-drillstring-component-image
                              c-drillstring-component-image--${this.props.component.get('family')}`}>
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
      case 'dc':
        return this.renderComponentDC();
      case 'stabilizer':
        return this.renderComponentStabilizer();
      case 'sub':
        return this.renderComponentSub();
      case 'mwd':
        return this.renderComponentMWD();
      case 'jar':
        return this.renderComponentJar();
      default:
        return "";
    }
  }

  renderComponentDP() {
    return [      
      <Row key="dp-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joint","# of Joints",4)}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField('grade', 'Grade',4)}
      </Row>,
        
      <Row key="dp-2">
        {this.renderComponentLabelField("tool_joint_od", "TJ OD", 4)}
        {this.renderComponentLabelField("tool_joint_id", "TJ ID", 4)}
        {this.renderComponentLabelField("tool_joint_length", "TJ Length per Joint", 4)}
        {this.renderComponentLabelField("norminal_linear_weigth", "Norminal Linear Weight", 4)}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField('material',"Material",4)}
        {this.renderComponentLabelField("class", "Class", 4)}
      </Row>
    ];
  }

  renderComponentLabelField(field,label="",colSize=2,unitType,unit) {
    let value = this.props.component.get(field, '');
    if (value!=='' && unitType && unit) {
      value = this.props.convert.convertValue(value,unitType,unit).formatNumeral('0.0');
    }
    return <Col m={colSize} s={12}>
      <label>{label}</label>
      <br/>
      <label>{value}</label>
    </Col>;
  }
}

DrillstringComponentModal.propTypes = {
  component: ImmutablePropTypes.map.isRequired  
};

export default DrillstringComponentModal;