import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input, Row, Col } from 'react-materialize';
import { List, Map } from 'immutable';

import { COMPONENT_FAMILIES, COMPONENT_GRADES, COMPONENT_MATERIALS, COMPONENT_CATALOGUES, HWDP_SUB_CATEGORIES, DC_SUB_CATEGORIES, JAR_SUB_CATEGORIES } from './constants';

import './DrillstringComponentEditorItem.css';



class DrillstringComponentEditorItem extends Component {

  shouldComponentUpdate(nextProps,nextState) {
    if (!this.props.item.equals(nextProps.item.equals)) {
      return true;
    }
    return false;
  }

  render() {
    return <div className="c-drillstring-component-editor-item">
      <Row>
        <Col s={1}>
          {this.props.dragHandle(this.renderComponentImage())}
        </Col>
        <Col s={11}>
          {this.renderComponent()}
        </Col>
      </Row>

      <Row>
        <Col s={11}></Col>
        <Col s={1}>
          <Button floating icon="delete" className="red" onClick={() => this.props.commonProps.onDeleteComponent(this.props.item.get('id'))}></Button>
        </Col>
      </Row>
      
    </div>;
  }

  renderComponentImage() {
    return <div className={`c-drillstring-component-image                              
                              c-drillstring-component-image--${this.props.item.get('family')}`}>
      </div>;
  }

  renderComponent() {
    switch(this.props.item.get("family")) {
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
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint","# of Joints",1)}        
        {this.renderComponentNumberField("length", "Component Length", 1,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 1,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 1, "mass","lb")}
        {this.renderComponentSelectField('grade', 1, COMPONENT_GRADES)}
      </Row>,
        
      <Row key="dp-2">
        {this.renderComponentNumberField("tool_joint_od", "TJ OD", 1)}
        {this.renderComponentNumberField("tool_joint_id", "TJ ID", 1)}
        {this.renderComponentNumberField("tool_joint_length", "TJ Length per Joint", 2)}        
        {this.renderComponentNumberField("norminal_linear_weigth", "Norminal Linear Weight", 2)}
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
        {this.renderComponentTextField("name", "Name", 1)}
        {this.renderComponentSelectField('sub_category', 1, HWDP_SUB_CATEGORIES)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint","# of Joints",1)}        
        {this.renderComponentNumberField("length", "Component Length", 1,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 1,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 1, "mass","lb")}
        {this.renderComponentSelectField('grade', 1, COMPONENT_GRADES)}
      </Row>,

      <Row key="hwdp-2">
        {this.renderComponentNumberField("tool_joint_od", "TJ OD", 1)}
        {this.renderComponentNumberField("tool_joint_id", "TJ ID", 1)}
        {this.renderComponentNumberField("tool_joint_length", "TJ Length per Joint", 2)}        
        {this.renderComponentNumberField("norminal_linear_weigth", "Norminal Linear Weight", 2)}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', 2, COMPONENT_MATERIALS)}
        {this.renderComponentTextField("class", "Class", 2)}
      </Row>   
    ];
  }

  renderComponentPDM() {
    return [
      <Row key="pdm-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 1,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 1, "mass","lb")}
        {this.renderComponentSelectField('info', 1, COMPONENT_CATALOGUES)}
      </Row>,
      
      <Row key="pdm-2">
        {this.renderComponentNumberField('number_rotor_lobes', '# of rotor lobes',4)}
        {this.renderComponentNumberField('number_stator_lobes', '# of stator lobes',4)}
        {this.renderComponentNumberField('rpg', 'RPG',4)}
      </Row>
    ];
  }

  renderComponentBIT() {
    return [
      <Row key="bit-1">
        {this.renderComponentSelectField('family', 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 4)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("total_length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("total_weight", "Total Weight", 2, "mass","lb")}
      </Row>,
      <Row key="bit-nozzles">        
        <Col s={10}>
          <h4>Nozzle Sizes</h4>
          <table>
            <thead>
              <tr>
                <th>Nozzle Size</th>
                <th> # of this size </th>
              </tr>
            </thead>
            <tbody>
            {this.props.item.get('nozzle_sizes',List([])).map((nozzle, index)=> {
              return (
                <tr key={index}>
                  <td>
                    {this.renderNozzleNumberField(index,"size")}
                  </td>
                  <td>
                    {this.renderNozzleNumberField(index,"count")}
                  </td>
                  <td>
                    <Button floating icon="delete" className="red" onClick={() => this.onDeleteNozzle(index)}></Button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
          <Button floating icon="add" onClick={() => this.onAddNozzle()}></Button>
        </Col>        
      </Row>,
      <Row key="bit-3">
        {this.renderComponentTextField("shank_od", "Shank OD", 2)}
        {this.renderComponentTextField("make", "Make", 2)}
        {this.renderComponentTextField("serial_number", "Serrial Number", 2)}
        {this.renderComponentTextField("model", "Model", 3)}
        {this.renderComponentNumberField("tfa", "TFA", 3)}
      </Row>
    ];
  }

  renderComponentDC() {
    return [
      <Row key="dc-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentSelectField('sub_category', 1, DC_SUB_CATEGORIES)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint","# of Joints",2)}
        {this.renderComponentNumberField("length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 2,"length","ft")}
      </Row>,

      <Row key="dc-2">
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 3,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 3, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 3)}
        {this.renderComponentSelectField('material', 3, COMPONENT_MATERIALS)}
      </Row>   
    ];
  }

  renderComponentSub() {
    return [
      <Row key="sub-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 3)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 2,"length","ft")}
        
      </Row>,

      <Row key="sub-2">
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 3,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 3, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 3)}
        {this.renderComponentSelectField('material', 3, COMPONENT_MATERIALS)}
      </Row>
    ];
  }

  renderComponentStabilizer() {
    return [
      <Row key="stabilizer-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("length", "Component Length", 1,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 2, "mass","lb")}
      </Row>,

      <Row key="stabilizer-2">
        {this.renderComponentNumberField("gauge_od", "Gauge OD", 2)}
        {this.renderComponentNumberField("gauge_length", "Gauge Length", 2)}
        {this.renderComponentNumberField("no_of_blades", "# of Blades", 2)}
        {this.renderComponentNumberField("blade_width", "Blade Width", 2)}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', 2, COMPONENT_MATERIALS)}
      </Row>   
    ];
  }

  renderComponentJar() {
    return [
      <Row key="jar-1">
        {this.renderComponentSelectField('family', 2, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentSelectField('sub_category', 2, JAR_SUB_CATEGORIES)}
        {this.renderComponentNumberField("outer_diameter","OD",2,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",2,'shortLength','in')}
        {this.renderComponentNumberField("number_of_joint", "# of Joints", 2)}
        
      </Row>,
      <Row key="jar-2">
        {this.renderComponentNumberField("length", "Component Length", 2,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 2,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 2, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 2)}
        {this.renderComponentSelectField('material', 2, COMPONENT_MATERIALS)}
      </Row>
    ];
  }

  renderComponentMWD() {
    return [
      <Row key="mwd-1">
        {this.renderComponentSelectField('family', 1, COMPONENT_FAMILIES)}
        {this.renderComponentTextField("name", "Name", 2)}
        {this.renderComponentNumberField("outer_diameter","OD",1,'shortLength','in')}
        {this.renderComponentNumberField("inner_diameter","ID",1,'shortLength','in')}
        {this.renderComponentNumberField("length", "Component Length", 1,"length","ft")}
        {this.renderComponentLabelField("total_length", "Total Length", 1,"length","ft")}
        {this.renderComponentNumberField("adjust_linear_weight", "Adjust Linear Weight", 2,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("total_weight", "Total Weight", 1, "mass","lb")}
        {this.renderComponentTextField("connection_type", "Connection Type", 1)}
        {this.renderComponentSelectField('material', 1, COMPONENT_MATERIALS)}
      </Row>,

      <Row key="mwd-2">
        {this.renderComponentTextField("sensor_to_bit_distance","Sensor to bit distance",3)}
      </Row>   
    ];
  }

  renderComponentNumberField(field, label, colSize, unitType=null, unit=null) {
    let value = this.props.item.get(field, '');
    if (field === 'number_of_joint') {
      value = 1;
    }
    if (value!=='' && unitType && unit) {
      value = this.props.commonProps.convert.convertValue(value,unitType,unit);
    }
    let errors = this.props.commonProps.errors;
    let compId = this.props.item.get('id');

    return <Input type="number"
                  label={label}
                  m={colSize}
                  s={12}                  
                  defaultValue={value}
                  error={errors && errors[compId] && errors[compId][field]? errors[compId][field]: null}
                  ref={field}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={e => this.onNumberFieldChange.bind(this)(field,parseFloat(e.target.value))} />;    
  }

  renderComponentTextField(field, label="", colSize=2) {    
    return <Input type="text"                  
                  label={label}
                  m={colSize}
                  s={12}
                  defaultValue={this.props.item.get(field, '')}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={e => this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), field, e.target.value)} />;
  }

  renderComponentSelectField(field, colSize=2, options) {    
    return <Input type="select"
                  m={colSize}
                  s={12}
                  defaultValue={this.props.item.get(field, '')}
                  onChange={e => { setTimeout(_=> {this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), field, e.target.value);}, 0);}}>
      {options.map(({name, type}) =>
        <option key={type} value={type}>{name}</option>)}
    </Input>;
  }

  renderComponentLabelField(field,label="",colSize=2,unitType,unit) {
    let value = this.props.item.get(field, '');
    if (value!=='' && unitType && unit) {
      value = this.props.commonProps.convert.convertValue(value,unitType,unit).formatNumeral('0.0');
    }
    return <Col m={colSize} s={12}>
      <label>{label}</label>
      <br/>
      <label>{value}</label>
    </Col>;
  }

  renderNozzleNumberField(index,key) {
      return <Input type="number"                
                s={12}
                defaultValue={this.props.item.getIn(["nozzle_sizes",index,key])}
                onChange={e => this.onNozzleValueChange(index, key, parseFloat(e.target.value))} />;
  }

  calcLinearWeight(id,od) {
    id = parseFloat(id);
    od = parseFloat(od);
    if (isNaN(id) || isNaN(od) || od<id) {
      return;
    }
    return 2.673*(od*od-id*id);
  }

  calcTotalWeight(linearWeight,totalLength) {
    linearWeight = parseFloat(linearWeight);
    totalLength = parseFloat(totalLength);
    if (isNaN(linearWeight) || isNaN(totalLength)) {
      return;
    }
    return linearWeight*totalLength;
  }

  calcTotalLength(noJoint,length) {
    noJoint = parseFloat(noJoint);
    length = parseFloat(length);
    if (isNaN(noJoint) || isNaN(length)) {
      return;
    }
    return noJoint*length; 
  }

  onNumberFieldChange(field,value) {
    const component = this.props.item;
    let id,od,linearWeight,noJoint,length,totalLength,totalWeight;
    let nameValuePairs=[];
    switch(field) {
      case 'inner_diameter':
        id = value;
        od = component.get('outer_diameter');        
        linearWeight = this.calcLinearWeight(id,od);
        totalLength = component.get('total_length');
        totalWeight = this.calcTotalWeight(linearWeight,totalLength);
        break;
      case 'outer_diameter':
        id = component.get('inner_diameter');
        od = value;
        linearWeight = this.calcLinearWeight(id,od);
        totalLength = component.get('total_length');
        totalWeight = this.calcTotalWeight(linearWeight,totalLength);
        break;
      case 'adjust_linear_weight':
        totalLength = component.get('total_length');
        totalWeight = this.calcTotalWeight(value,totalLength);
        break;
      case 'number_of_joint':
        length = component.get('length');
        totalLength = this.calcTotalLength(value,length);
        linearWeight = component.get('adjust_linear_weight');
        totalWeight = this.calcTotalWeight(linearWeight,totalLength);
        break;
      case 'length':
        noJoint = component.get('number_of_joint',1);
        totalLength = this.calcTotalLength(noJoint,value);
        linearWeight = component.get('adjust_linear_weight');
        totalWeight = this.calcTotalWeight(linearWeight,totalLength);
        break;

      default:
        break;        
    }

    nameValuePairs=[{name:field,value}];

    if (linearWeight>=0) {
      nameValuePairs.push({name:"adjust_linear_weight", value: linearWeight});
      ReactDOM.findDOMNode(this.refs.adjust_linear_weight).children[0].value = linearWeight.formatNumeral('0.0');
      ReactDOM.findDOMNode(this.refs.adjust_linear_weight).children[1].className="active";
    }

    if (totalLength) {
      nameValuePairs.push({name:"total_length", value: totalLength}); 
    }

    if (totalWeight) {
      nameValuePairs.push({name:"total_weight", value: totalWeight}); 
    }
    
    this.props.commonProps.onComponentMultiFieldsChange(component.get('id'),nameValuePairs);
  }

  onAddNozzle() {
    let nozzle_sizes = this.props.item.get('nozzle_sizes',List([]));

    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "nozzle_sizes", nozzle_sizes.push(Map({
      size: '',
      count: ''
    })));
  }

  onDeleteNozzle(index) {
    const component = this.props.item;
    let nozzle_sizes = component.get('nozzle_sizes',List([]));
    this.props.commonProps.onComponentFieldChange(component.get('id'), "nozzle_sizes", nozzle_sizes.delete(index));
    setTimeout(_=> {
      this.onCalcTFA();
    },0);
  }

  onNozzleValueChange(index,key,val) {
    const component = this.props.item;
    const nozzle_sizes = component.get('nozzle_sizes');
    this.props.commonProps.onComponentFieldChange(component.get('id'), "nozzle_sizes", nozzle_sizes.setIn([index,key],val) );
    setTimeout(_=> {
      this.onCalcTFA();
    },0);
  }

  onCalcTFA() {
    const component = this.props.item;
    let nozzle_sizes = component.get('nozzle_sizes',List([]));
    let tfa = 4/Math.PI*nozzle_sizes.reduce((acc,nozzle)=> {
      return acc+nozzle.get('count',0)* Math.pow(nozzle.get('size',0)/32,2);      
    },0);

    this.props.commonProps.onComponentFieldChange(this.props.item.get('id'), "tfa", tfa);

    ReactDOM.findDOMNode(this.refs.tfa).children[0].value = tfa.formatNumeral('0.0');
    ReactDOM.findDOMNode(this.refs.tfa).children[1].className="active";
  }

  handleKeyPress() {

  }

}

DrillstringComponentEditorItem.propTypes = {  
};

export default DrillstringComponentEditorItem;