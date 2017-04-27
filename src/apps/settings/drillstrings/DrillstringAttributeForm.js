import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col,Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './DrillstringAttributeForm.css';

class DrillstringAttributeForm extends Component {

  constructor(props) {
    super(props);
    this.initialDate = moment().unix();    
  }

  componentWillMount() {
    if (!this.getAttr('start_timestamp')) {
      this.updateAttrs([
        {name:"start_timestamp",value:this.initialDate},
        {name:"end_timestamp", value:this.initialDate}]
      );
    }
  }

  componentDidMount() {
    // this is hack code to fix the known placeholder bug in materialize
    // this should be the global solution by forking the react-materialize repo
    // or we should consider using other materialize library.
    this.fixPlaceholderIssue();
  }

  render() {
    return <div>
      <Row key="attributes1" className="c-drillstring-editor__attributes ">
        <Input
          m={4}
          label="Drillstring/BHA Number"          
          type="number"
          error={this.props.errors["id"]}          
          ref="bha_number"
          defaultValue={this.getAttr('id', '')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('id', e.target.value,true)}/>
        <Input
          m={4}
          type="checkbox"
          className="drillstring__chk-planning"
          label="Is for Planning?"
          checked={this.getAttr('planning', false)}
          onChange={e => this.updateAttr('planning', e.target.checked)}/>
      </Row>
      <Row key="attributes2" className="c-drillstring-editor__attributes">
        <Input
          label="Depth In"
          m={4}
          type="number"
          ref="start_depth"          
          defaultValue={numeral(this.props.convert.convertValue(this.getAttr('start_depth', 0), 'length', 'ft')).format('0')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('start_depth', e.target.value,true)}/>
        <Input
          m={4}
          label="Depth Out"
          type="number"
          ref="end_depth"
          defaultValue={numeral(this.props.convert.convertValue(this.getAttr('end_depth', 0), 'length', 'ft')).format('0')}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={e => this.updateAttr('end_depth', e.target.value,true)}/>
      </Row>
      <Row key="attributes3" className="c-drillstring-editor__attributes">
        <Col m={4}>
          <label> Time In </label>
          <Datetime 
            defaultValue={this.getAttr('start_timestamp')? moment.unix(this.getAttr('start_timestamp')): moment.unix(this.initialDate)} 
            onChange={this.startTimeChanged.bind(this)} />
        </Col>

        <Col m={4}>
          <label> Time Out </label>
          <Datetime 
            defaultValue={this.getAttr('end_timestamp')? moment.unix(this.getAttr('end_timestamp')): moment.unix(this.initialDate)} 
            onChange={this.endTimeChanged.bind(this)} />
        </Col>

       
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

  startTimeChanged(newDateTime) {
    this.updateAttr('start_timestamp',newDateTime.unix());    
  }

  endTimeChanged(newDateTime) {
    this.updateAttr('end_timestamp',newDateTime.unix());    
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

  updateAttrs(nameValuePairs) {    
    let record = this.props.record;
    nameValuePairs.map(nameValue=> {
      let {name,value} = nameValue;
      record = record.setIn(['data', name], value);
      return nameValue;
    });

    if (record) {
      this.props.onUpdateRecord(record);
    }    
  }
}

DrillstringAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export default DrillstringAttributeForm;