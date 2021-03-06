import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './FluidCheckAttributeForm.css';

class FluidCheckAttributeForm extends Component {
  constructor(props) {
    super(props);
    this.initialDate = moment().unix();    
  }

  componentWillMount() {
    if (!this.getAttr('date')) {      
      this.updateAttr('date',this.initialDate);
    }
  }
 
  componentDidMount() {
    // this is hack code to fix the known placeholder bug in materialize
    // this should be the global solution by forking the react-materialize repo
    // or we should consider using other materialize library.
    this.fixPlaceholderIssue();
    
    
  }
  render() {
    return <div className="c-fluid-checks-editor__top">
      <Row key="attributes1" className="c-fluid-checks-editor__attributes">
        <Input type="select"
          m={4}          
          label="Mud Type"
          defaultValue={this.getAttr('mud_type', '')}
          onChange={e => this.updateAttr('mud_type', e.target.value)}>
          <option value="">Select Mud Type</option>
          <option value="Water-base">Water-base</option>
          <option value="Oil-base">Oil-base</option>
          <option value="Synthetic-base">Synthetic-base</option>
        </Input>

        <Input
          m={4}
          label="Density"
          error={this.props.errors["mud_density"]}
          type="number"
          ref="mud_density"
          defaultValue={this.getAttr('mud_density', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('mud_density', e.target.value,true)} />
      </Row>

      <Row key="attributes2" className="c-fluid-checks-editor__attributes">
        <Col m={4}>
          <label> Date </label>
          <Datetime 
            defaultValue={this.getAttr('date')? moment.unix(this.getAttr('date')): moment.unix(this.initialDate)} 
            onChange={this.selectDate.bind(this)} 
          />
        </Col>

        <Input
          m={4}
          label="Depth"
          error={this.props.errors["depth"]}
          type="number"
          ref="depth"
          defaultValue={this.getAttr('depth', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('depth', e.target.value,true)} />        
      </Row>

      <Row key="attributes3" className="c-fluid-checks-editor__attributes">
        <Input
          m={4}
          label="Mud cake thickness (30 min)"
          error={this.props.errors["mud_cake_thickness"]}
          type="number"
          ref="mud_cake_thickness"
          defaultValue={this.getAttr('mud_cake_thickness', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('mud_cake_thickness', e.target.value,true)} />
        
        <Input
          m={4}
          label="Filterate (30 min)"
          error={this.props.errors["filterate"]}
          type="number"
          ref="filterate"
          defaultValue={this.getAttr('filterate', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('filterate', e.target.value,true)} />
      </Row>

      <Row key="attributes4" className="c-fluid-checks-editor__attributes">
        <Input
          m={4}
          label="PH"
          error={this.props.errors["ph"]}
          type="number"
          ref="ph"
          defaultValue={this.getAttr('ph', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('ph', e.target.value,true)} />
      </Row>
    </div>;
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

  selectDate(newDateTime) {    
    this.updateAttr('date',newDateTime.unix());    
  }

  getAttr(name, notSetValue) {
    return this.props.record.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value, isNumber) {
    if (isNumber) {
      value = isNaN(parseFloat(value))? value: parseFloat(value);
    }
    this.props.onUpdateRecord(this.props.record.setIn(['data', name], value));
  }

}

FluidCheckAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export default FluidCheckAttributeForm;
