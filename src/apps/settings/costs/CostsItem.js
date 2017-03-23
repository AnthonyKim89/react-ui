import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button, Col, Row } from 'react-materialize';
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './CostsItem.css';

class CostsItem extends Component { 
  constructor(props) {
    super(props);
    const recordData = props.record.get("data");
    
    this.state = {
      date: moment.unix(recordData.get("date")),
      cost: recordData.get("cost"),
      description: recordData.get("description"),      
      editing: false
    }
   
    this.selectDate = this.selectDate.bind(this); 
  }

  render() {
    let item = !this.state.editing? (
      <tr className='c-cost-item'>
        <td className="td-1">{this.state.date.format('L')}</td>
        <td className="td-2">{this.state.cost}</td>
        <td className="td-3">{this.state.description}</td>
        <td className="td-4">
          <Button floating className='lightblue' waves='light' icon='edit' onClick={()=>this.setState({editing:true})} />
          <Button floating className='red' waves='light' icon='remove' onClick={()=>this.remove()} />
        </td>
      </tr>
    ) : (
      <tr className='c-cost-item'>
        <td>
          <DatePicker
            selected={this.state.date}
            onChange={this.selectDate} />
        </td>
        <td>
          <Input type="text" 
            s={12}
            defaultValue={this.state.cost}
            onChange={(e)=>{this.setState({cost: e.target.value})}} />
        </td>
        <td>
          <Input type="text" 
            s={12} 
            defaultValue={this.state.description} 
            onChange={(e)=>{this.setState({description: e.target.value})}} />
        </td>
        <td>
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
    )

    return item;
  }

  save() {    
    this.setState({editing:false});
    
    const record = this.props.record.update('data',(oldMap) => {
      const newMap = oldMap.set("date",this.state.date.unix())
            .set("cost",parseFloat(this.state.cost))
            .set("description",this.state.description)
      return newMap;
    })      
    
    this.props.onSave(record)
  }

  remove() {
    this.props.onRemove(this.props.record);
  }

  cancelEdit() {
    this.setState({editing:false});
  }

  selectDate(date) {
    this.setState({
      date: date
    });
  }

}
export default CostsItem;
