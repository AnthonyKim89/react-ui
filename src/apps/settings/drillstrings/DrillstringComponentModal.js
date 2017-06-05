import React, { Component } from 'react';
import { Row,Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';

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

  renderComponentHWDP() {
    return [
      <Row key="hwdp-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joint","# of Joints",4)}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField('grade', 'Grade',4)}
      </Row>, 

      <Row key="hwdp-2">
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

  renderComponentPDM() {
    return [
      <Row key="pdm-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}        
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField('info', 'Info',4)}
      </Row>,

      <Row key="pdm-2">
        {this.renderComponentLabelField("number_rotor_lobes", "# of rotor lobes", 4)}
        {this.renderComponentLabelField("number_stator_lobes", "# of stator lobes", 4)}
        {this.renderComponentLabelField('rpg', 'RPG', 4)}
      </Row>

    ];
  }

  renderComponentBIT() {
    return [
      <Row key="bit-1">
        {this.renderComponentLabelField("name", "Name", 3)}
        {this.renderComponentLabelField("outer_diameter","OD",3,'shortLength','in')}        
        {this.renderComponentLabelField("total_length", "Total Length", 3,"length","ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 3, "mass","lb")}
      </Row>,

      <Row key="bit-nozzles">        
        <Col s={12}>
          <h4>Nozzle Sizes</h4>
          <table>
            <thead>
              <tr>
                <th>Nozzle Size</th>
                <th> # of this size </th>
              </tr>
            </thead>
            <tbody>              
            {this.props.component.get('nozzle_sizes',List([])).map((nozzle, index)=> {
              return (
                <tr key={index}>
                  <td>
                    {this.renderNozzleNumberField(index,"size")}
                  </td>
                  <td>
                    {this.renderNozzleNumberField(index,"count")}
                  </td>                  
                </tr>
              );
            })}
            </tbody>
          </table>          
        </Col>        
      </Row>,

      <Row key="bit-3">
        {this.renderComponentLabelField("shank_od", "Shank OD", 2)}
        {this.renderComponentLabelField("make", "Make", 2)}
        {this.renderComponentLabelField("serial_number", "Serrial Number", 2)}
        {this.renderComponentLabelField("model", "Model", 3)}
        {this.renderComponentLabelField("tfa", "TFA", 3)}
      </Row>
    ];
  }

  renderComponentDC() {
    return [
      <Row key="dc-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joint","# of Joints",4)}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
      </Row>,

      <Row key="dc-2">
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];    
  }

  renderComponentSub() {
    return [
      <Row key="sub-1">
        {this.renderComponentLabelField("name", "Name", 4)}        
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
      </Row>,

      <Row key="sbu-2">
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];
  }

  renderComponentStabilizer() {
    return [
      <Row key="stabilizer-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
      </Row>,

      <Row key="stabilizer-2">
        {this.renderComponentLabelField("gauge_od", "Gauge OD", 4)}
        {this.renderComponentLabelField("gauge_length", "Gauge Length", 4)}
        {this.renderComponentLabelField("no_of_blades", "# of Blades", 4)}
        {this.renderComponentLabelField("blade_width", "Blade Width", 4)}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
        
    ];
  }

  renderComponentJar() {
    return [
      <Row key="jar-1">
        {this.renderComponentLabelField("name", "Name", 4)}
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joint","# of Joints",4)}
      </Row>,

      <Row key="jar-2">
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];
  }

  renderComponentMWD() {
    return [
      <Row key="mwd-1">
        {this.renderComponentLabelField("name", "Name", 4)}        
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("adjust_linear_weight", "Adjust Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>,

      <Row key="mwd-2">
        {this.renderComponentLabelField("sensor_to_bit_distance", "Sensor to bit distance", 4)}
      </Row>
    ];
  }

  renderNozzleNumberField(index,key) {
    return <Col s={12}>
      <label>{key}</label>
      <br/>
      <label>{this.props.component.getIn(["nozzle_sizes",index,key])}</label>
    </Col>;
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