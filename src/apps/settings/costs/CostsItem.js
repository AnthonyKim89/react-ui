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
    const record = props.record;
    this.state = {
      date: record.getIn(["data","date"])? moment.unix(record.getIn(["data","date"])) : moment(),
      cost: record.getIn(["data","cost"]) || 0,
      description: record.getIn(["data","description"]) || "directional services",
      editing: record.has("_id")? false : true
    };
   
    this.selectDate = this.selectDate.bind(this); 
  }
  
  render() {

    if (!this.state.editing) return (
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
          <Input type="number" 
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
    if (isNaN(parseFloat(this.state.cost))) {
      this.setState({cost:0},()=>{
        this.save();
      });
      return;
    }

    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("date",this.state.date.unix())
        .set("cost",parseFloat(this.state.cost))
        .set("description",this.state.description);
    });

    this.props.onSave(record);

    if (this.props.record.has("_id")) {
      this.setState({editing:false});
    }
  }

  remove() {
    this.props.onRemove(this.props.record);
  }

  cancelEdit() {
    if (this.props.record.has("_id")) {
      this.setState({editing:false});
    }
    else {
      this.props.onCancel(this.props.record);
    }
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
  
};

export default CostsItem;
