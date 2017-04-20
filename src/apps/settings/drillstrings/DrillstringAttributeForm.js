import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Row, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringAttributeForm.css';

class DrillstringAttributeForm extends Component {

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
          defaultValue={this.getAttr('start_depth', 0)}
          onChange={e => this.updateAttr('start_depth', e.target.value,true)}/>
        <Input
          m={4}
          label="Depth Out"
          type="number"
          ref="end_depth"
          defaultValue={this.getAttr('end_depth', 0)}
          onChange={e => this.updateAttr('end_depth', e.target.value,true)}/>
      </Row>
      <Row key="attributes3" className="c-drillstring-editor__attributes">
        <Input
          m={4}
          label="Time In"
          type="number"
          ref="start_timestamp"
          defaultValue={this.getAttr('start_timestamp', 0)}
          onChange={e => this.updateAttr('start_timestamp', e.target.value,true)}/>
        <Input
          m={4}
          label="Time Out"
          type="text"
          ref="end_timestamp"
          defaultValue={this.getAttr('end_timestamp', 0)}
          onChange={e => this.updateAttr('end_timestamp', e.target.value,true)}/>
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

DrillstringAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export default DrillstringAttributeForm;