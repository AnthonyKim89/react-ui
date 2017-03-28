import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import moment from 'moment';
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
    };
   
    this.selectDate = this.selectDate.bind(this); 
  }
  
  render() {
    if (this.state.editing) return (
      <tr className='c-cost-item'>
        <td>{this.state.date.format('L')}</td>
        <td>{this.state.cost}</td>
        <td>{this.state.description}</td>
        <td>
          <Button floating className='lightblue' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
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
            onChange={e => this.setState({cost: e.target.value})} />
        </td>
        <td>
          <Input type="text" 
            s={12} 
            defaultValue={this.state.description} 
            onChange={e => this.setState({description: e.target.value})} />
        </td>
        <td>
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
    );
  }

  save() {    
    this.setState({editing:false});
    
    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("date",this.state.date.unix())
        .set("cost",parseFloat(this.state.cost))
        .set("description",this.state.description);
    });

    this.props.onSave(record);
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

CostsItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  
};

export default CostsItem;
