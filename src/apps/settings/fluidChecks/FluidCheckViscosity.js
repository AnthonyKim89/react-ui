import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button} from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {List, Map } from 'immutable';
import uuidV1 from 'uuid/v1';

import './FluidCheckViscosity.css';
class FluidCheckViscosity extends Component {
  componentDidMount() {
    // this is hack code to fix the known placeholder bug in materialize
    // this should be the global solution by forking the react-materialize repo
    // or we should consider using other materialize library.
    this.fixPlaceholderIssue();
  }
  render() {
    return <div className="c-fluid-check-viscosity">
      <h5>Viscosity</h5>
      {this.props.isEditable && this.props.errors["rpm_readings_required"]?
        <div style={{color:'red'}}>
          Please input PV and YP or at least 2 pairs of rpm and dial_readings, which are required.
        </div> 
        : ''
      }
      <Row>
        {this.renderField('pv', 'PV')}
        {this.renderField('yp', 'YP')}
        {this.renderField('marsh_funnel', 'Marsh Funnel')}
      </Row>

      {this.renderRpmReadingTable()}

      {!this.props.isEditable? 
        <div>
          <hr/>
                  
          <Row>
            <Col l={4} m={6} s={12}>
              <div>Mud cake thickness (30 min)</div>
              <div>
                {this.props.record.getIn(['data', 'mud_cake_thickness'])}
              </div>
            </Col>
            <Col l={4} m={6} s={12}>
              <div>Filterate (30 min)</div>
              <div>
                {this.props.record.getIn(['data', 'filterate'])}
              </div>
            </Col>
          </Row>          

          <Row>
            <Col l={4} m={6} s={12}>
              <div>PH</div>
              <div>
                {this.props.record.getIn(['data', 'ph'])}
              </div>
            </Col>
            
          </Row>
        </div> : ''
      }
    </div>;
  }

  renderField(name, label) {
    if (this.props.isEditable) {
      return <Input m={4}
                    label={label}
                    error={this.props.errors[name]}
                    type="number"
                    ref={name}
                    defaultValue={this.getValue(name, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.onValueChange(name, e.target.value,true)} />;
    } else {
      return [
        <Col l={2} m={4} s={12} key={`${name}-label`}>
          {label}<br/>
          {this.getValue(name, '')}
        </Col>
      ];
    }
  }

  renderRpmReadingTable() {
    return (      
      <div className="c-fluid-check-viscosity__rpm-readings">
        <hr/>
        <h6>Rheometer Readings</h6>
        { this.props.record.getIn(['data','viscosity','rpm_readings'],List()).size>0 ? 
        <table>
          <thead>
            <tr> 
              <th>
                <Row className="c-fluid-check-viscosity__rpm-readings-header">
                  <Col l={4} m={5} s={12}>RPM</Col>
                  <Col l={4} m={5} s={12}>Dial Reading</Col>
                </Row>
              </th>
            </tr>
          </thead>        
          <tbody>
            {this.props.record.getIn(['data','viscosity','rpm_readings'],List()).map((r,idx)=> {
              return (                
                <tr key={r.get("id")}>
                  { this.props.isEditable?
                    
                    <td>                      
                      <Row>
                        <Input l={4} m={5} s={12}
                          label="rpm"
                          error={this.props.errors["rpm_readings"] && this.props.errors["rpm_readings"][idx] ? this.props.errors["rpm_readings"][idx]["rpm"]:''}
                          type="number"
                          ref="rpm{idx}"
                          defaultValue={this.getReadingValue(idx,'rpm', '')}
                          onKeyPress={this.handleKeyPress.bind(this)}
                          onChange={e => this.onReadingValueChange(idx,'rpm', e.target.value,true)} />
                      
                        <Input l={4} m={5} s={12}
                          label="dial reading"
                          error={this.props.errors["rpm_readings"] && this.props.errors["rpm_readings"][idx]? this.props.errors["rpm_readings"][idx]["dial_reading"]:''}
                          type="number"
                          ref="dial_reading{idx}"
                          defaultValue={this.getReadingValue(idx,'dial_reading', '')}
                          onKeyPress={this.handleKeyPress.bind(this)}
                          onChange={e => this.onReadingValueChange(idx,'dial_reading', e.target.value,true)}  />

                        <Col l={4} m={2} s={12}>
                          <Button floating icon="delete" className="red" onClick={() => this.onDeleteComponent.bind(this)(idx)}></Button>
                        </Col>

                        </Row>                        
                    </td>
                    :
                    <td>
                      <Row>
                        <Col l={4} m={5} s={12}>{this.getReadingValue(idx,'rpm', '')}</Col>
                        <Col l={4} m={5} s={12}>{this.getReadingValue(idx,'dial_reading', '')}</Col>
                      </Row>
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table> : ''}
        { this.props.isEditable?
          <div>
            <Button floating icon="add" onClick={() => this.onAddReading()}></Button>
          </div>: ""}
      </div>      
    );
  }

  fixPlaceholderIssue() {    
    for (let ref in this.refs) {
      let refDom = ReactDOM.findDOMNode(this.refs[ref]);
      if (refDom.children[0].value === '0') {
        refDom.children[1].className="active";
      }      
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {      
      this.props.onSave();
    }
  }

  onAddReading() {
    const newRpmReading = Map({
      rpm: '',
      id: uuidV1(),
      dial_reading:'',
      order: this.props.record.getIn(['data', 'viscosity','rpm_readings']).size
    });

    this.props.onUpdateRecord(this.props.record.updateIn(['data', 'viscosity','rpm_readings'], c => c.push(newRpmReading)));
  }

  onDeleteComponent(index) {  
    this.props.onUpdateRecord(this.props.record.deleteIn(['data', 'viscosity', 'rpm_readings', index]));
  }

  getValue(name, notSetValue) {
    return this.props.record.getIn(['data', 'viscosity', name], notSetValue);
  }

  onValueChange(name, value,isNumber) {
    if (isNumber) {
      value = isNaN(parseFloat(value))? value: parseFloat(value);
    }
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'viscosity', name], value));
  }

  getReadingValue(idx,name,noSetValue) {
    return this.props.record.getIn(['data', 'viscosity', 'rpm_readings', idx, name], noSetValue);
  }

  onReadingValueChange(idx,name, value,isNumber) {
    if (isNumber) {
      value = isNaN(parseFloat(value))? value: parseFloat(value);
    }
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'viscosity', 'rpm_readings', idx, name], value));
  }

}

FluidCheckViscosity.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onUpdateRecord: PropTypes.func
};

export default FluidCheckViscosity;