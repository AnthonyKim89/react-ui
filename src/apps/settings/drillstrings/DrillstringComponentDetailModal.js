import React, { Component } from 'react';
import { Row,Col,Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';

class DrillstringComponentModal extends Component {

  render() {
    return <div className="c-drillstring-component-detail">
      <header>
        <Button className="c-drillstring-component-detail__done" onClick={ ()=> this.onDone() }>
          Close
        </Button>
        <h4 className="c-drillstring-component-detail__title">
          {this.props.component.get('name')} ( {this.props.component.get('family')} )
        </h4>
      </header>
      <Row>        
        <Col s={12}>
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
      case 'rss':
        return this.renderComponentRSS();
      case 'jar':
        return this.renderComponentJar();
      default:
        return "";
    }
  }

  renderComponentDP() {
    return [      
      <Row key="dp-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joints","# of Joints",4)}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField('grade', 'Grade',4)}      
        {this.renderComponentLabelField("outer_diameter_tooljoint", "TJ OD", 4)}
        {this.renderComponentLabelField("inner_diameter_tooljoint", "TJ ID", 4)}
        {this.renderComponentLabelField("length_tooljoint", "TJ Length per Joint", 4)}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField('material',"Material",4)}
        {this.renderComponentLabelField("class", "Class", 4)}
      </Row>
    ];
  }

  renderComponentHWDP() {
    return [
      <Row key="hwdp-1">
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joints","# of Joints",4)}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField('grade', 'Grade',4)}      
        {this.renderComponentLabelField("outer_diameter_tooljoint", "TJ OD", 4)}
        {this.renderComponentLabelField("inner_diameter_tooljoint", "TJ ID", 4)}
        {this.renderComponentLabelField("length_tooljoint", "TJ Length per Joint", 4)}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField('material',"Material",4)}
        {this.renderComponentLabelField("class", "Class", 4)}
      </Row>
    ];
  }

  renderComponentPDM() {
    return [
      <Row key="pdm-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("rpg","RPG",4)}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("stages", "# of stages", 4)}
        {this.renderComponentLabelField('number_rotor_lobes', '# of rotor lobes',4)}
        {this.renderComponentLabelField('number_stator_lobes', '# of stator lobes',4)}
        {this.renderComponentLabelField("bend_range", "Bend Range", 4)}
        {this.renderComponentLabelField("max_weight_on_bit", "Max WOB", 4)}
      </Row>,

      <Row key="pdm-standard-flow-range">
        <Col s={12} className="c-drillstring-component-detail__sub-title">
          Standard Flow Range
        </Col>
        {this.renderComponentLabelField('min_standard_flowrate', "Min", 3)}
        {this.renderComponentLabelField('max_standard_flowrate', 'Max',3)}
      </Row>,

      <Row key="pdm-op-diff-pressure">
        {this.renderComponentLabelField('max_operating_differential_pressure', 'Max Operating Diff Pressure', 3)}
        {this.renderComponentLabelField('torque_at_max_operating_differential_pressure', 'Torque at Max Operating Diff Pressure',3)}
      </Row>,

      <Row key="pdm-pressure-loss">
        <Col s={12} className="c-drillstring-component-detail__sub-title">
          Off Bottom Pressure Loss
        </Col>
        <Col s={12}>
          {this.props.component.get('off_bottom_pressure_loss',List([])).size > 0 &&
            <table>
              <thead>
                <tr>
                  <th> Flow Rate </th>
                  <th> Pressure Loss </th>
                </tr>
              </thead>
              <tbody>              
              {this.props.component.get('off_bottom_pressure_loss',List([])).map((obps, index)=> 
                <tr key={index}>
                  <td>
                    { obps.get("flow_rate") }
                  </td>
                  <td>
                    { obps.get("pressure_loss") }
                  </td>                  
                </tr>
              )}
              </tbody>
            </table>
          }
        </Col>        
      </Row>,      
    ];

    /*<Row key="pdm-rpm-curves">
      <Col s={12} className="c-drillstring-component-detail__sub-title">
        RPM Curves
      </Col>

      {this.props.component.get('rpm_curves',List([])).map((rpmCurve, rpmCurveIndex)=> 
        <Col s={6} key={rpmCurveIndex}>
          Flow rate: <span>{rpmCurve.get('flow_rate')}</span>
          {rpmCurve.get('diff_press_and_rpm',List([])).size > 0 &&
            <table>
              <thead>
                <tr>
                  <th> Diff Press </th>
                  <th> RPM </th>
                </tr>
              </thead>
              <tbody>              
              {rpmCurve.get('diff_press_and_rpm',List([])).map((dprpm, dprpmIndex)=> 
                <tr key={dprpmIndex}>
                  <td>
                    { dprpm.get("dp") }
                  </td>
                  <td>
                    { dprpm.get("rpm") }
                  </td>                  
                </tr>
              )}
              </tbody>
            </table>
          }            
        </Col>
      )}
    </Row>*/
  }

  renderComponentBIT() {
    return [
      <Row key="bit-1">
        {this.renderComponentLabelField("outer_diameter","OD", 4, 'shortLength','in')}
        {this.renderComponentLabelField("length", "Total Length", 4, "length","ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
      </Row>,

      <Row key="bit-nozzles">        
        <Col s={12}>
          {this.props.component.get('nozzle_sizes',List([])).size > 0 &&
            <table>
              <thead>
                <tr>
                  <th> Nozzle Size</th>
                  <th> # of this size </th>
                </tr>
              </thead>
              <tbody>              
              {this.props.component.get('nozzle_sizes',List([])).map((nozzle, index)=> {
                return (
                  <tr key={index}>
                    <td>
                      { this.props.component.getIn(["nozzle_sizes",index,"size"]) }
                    </td>
                    <td>
                      { this.props.component.getIn(["nozzle_sizes",index,"count"]) }
                    </td>                  
                  </tr>
                );
              })}
              </tbody>
            </table>
          }
        </Col>        
      </Row>,

      <Row key="bit-3">
        {this.renderComponentLabelField("shank_od", "Shank OD", 2)}
        {this.renderComponentLabelField("make", "Make", 2)}
        {this.renderComponentLabelField("serial_number", "Serial Number", 2)}
        {this.renderComponentLabelField("model", "Model", 3)}
        {this.renderComponentLabelField("tfa", "TFA", 3)}
      </Row>
    ];
  }

  renderComponentDC() {
    return [
      <Row key="dc-1">
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joints","# of Joints",4)}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];    
  }

  renderComponentSub() {
    return [
      <Row key="sub-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];
  }

  renderComponentStabilizer() {
    return [
      <Row key="stabilizer-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
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
        {this.renderComponentLabelField("sub_category", "Sub Category", 4)}
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("number_of_joints","# of Joints",4)}
        {this.renderComponentLabelField("component_length", "Component Length", 4,"length","ft")}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>
    ];
  }

  renderComponentMWD() {
    return [
      <Row key="mwd-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>,

      <Row key="mwd-pressure-loss">
        <Col s={12} className="c-drillstring-component-detail__sub-title">
          Pressure Loss
        </Col>
        <Col s={12}>
          {this.props.component.get('pressure_loss',List([])).size > 0 &&
            <table>
              <thead>
                <tr>
                  <th> Flow Rate </th>
                  <th> Pressure Loss </th>
                </tr>
              </thead>
              <tbody>              
              {this.props.component.get('pressure_loss',List([])).map((pl, index)=> 
                <tr key={index}>
                  <td>
                    { pl.get("flow_rate") }
                  </td>
                  <td>
                    { pl.get("pressure_loss") }
                  </td>                  
                </tr>
              )}
              </tbody>
            </table>
          }
        </Col>
      </Row>,
    ];
  }

  renderComponentRSS() {
    return [
      <Row key="rss-1">
        {this.renderComponentLabelField("outer_diameter","OD",4,'shortLength','in')}
        {this.renderComponentLabelField("inner_diameter","ID",4,'shortLength','in')}
        {this.renderComponentLabelField("length", "Total Length", 4,"length","ft")}
        {this.renderComponentLabelField("weight", "Total Weight", 4, "mass","lb")}
        {this.renderComponentLabelField("linear_weight", "Adjusted Linear Weight", 4,"massPerLength","lb-ft")}
        {this.renderComponentLabelField("connection_type", "Connection Type", 4)}
        {this.renderComponentLabelField("material", "Material", 4)}
      </Row>,

      <Row key="rss-pressure-loss">
        <Col s={12} className="c-drillstring-component-detail__sub-title">
          Pressure Loss
        </Col>
        <Col s={12}>
          {this.props.component.get('pressure_loss',List([])).size > 0 &&
            <table>
              <thead>
                <tr>
                  <th> Flow Rate </th>
                  <th> Pressure Loss </th>
                </tr>
              </thead>
              <tbody>              
              {this.props.component.get('pressure_loss',List([])).map((pl, index)=> 
                <tr key={index}>
                  <td>
                    { pl.get("flow_rate") }
                  </td>
                  <td>
                    { pl.get("pressure_loss") }
                  </td>                  
                </tr>
              )}
              </tbody>
            </table>
          }
        </Col>
      </Row>,
    ];
  }

  renderComponentLabelField(field,label="",colSize=2,unitType,unit) {
    let value = this.props.component.get(field) || '';

    let numberFormat;

    if (!isNaN(value)) {
      if (unitType && unit) {
        numberFormat='0.00';
        value = this.props.convert.convertValue(value,unitType,unit);
      };
      
      if (!unitType && !unit) {
        numberFormat='0';
      }

      if (field === 'tfa')  {
        numberFormat = '0.00';
      }
    }    

    if (numberFormat && value.formatNumeral) {      
      value = value.formatNumeral(numberFormat);
    }

    return <Col m={colSize} s={12}>
      <label className="field-label">{label}</label>
      <br/>
      <label className="field-value">{value!==""? value: "n/a"}</label>
    </Col>;
  }

  onDone() {
    this.props.onDone();
  }
}

DrillstringComponentModal.propTypes = {
  component: ImmutablePropTypes.map.isRequired  
};

export default DrillstringComponentModal;