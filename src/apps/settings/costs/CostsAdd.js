import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button, Col, Row } from 'react-materialize';
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './CostsAdd.css';

class CostsAdd extends Component { 
  constructor(props) {
    super(props);
    
    this.state = {
      date: moment(),
      cost: 20,
      description: "directional services"
    }

    this.selectDate = this.selectDate.bind(this);
  }

  render() {
    return (
      <div className="c-costs-add">
        <Row>
          <Col s={12}>
            <DatePicker
              selected={this.state.date}
              onChange={this.selectDate} />
          </Col>

          <Col s={12} m={6}>
            <Input type="text" label="Cost" s={12} defaultValue={this.state.cost} onChange={(e)=>{this.setState({cost: e.target.value})}} />
          </Col>

          <Col s={12} m={6}>
            <Input type="text" label="Description" s={12} defaultValue={this.state.description} onChange={(e)=>{this.setState({description: e.target.value})}} />
          </Col>
          
          <Col s={12}>
            <Button waves='light' onClick={()=>this.save()}>Save</Button>
            <Button waves='light' className="red" onClick={()=>this.cancel()}>Cancel</Button>
          </Col>
        </Row>
      </div>
    )
  }

  save() {
    const record = this.props.record.update('data',(oldMap) => {
      const newMap = oldMap.set("date",this.state.date.unix())
            .set("cost",parseFloat(this.state.cost))
            .set("description",this.state.description)
      return newMap;
    })      
    
    this.props.onSave(record)
  }

  cancel() {
   this.props.onCancel();
  }

  selectDate(date) {
    this.setState({
      date: date
    });
  }

}
export default CostsAdd;
