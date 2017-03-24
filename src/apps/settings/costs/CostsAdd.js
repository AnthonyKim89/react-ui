import React, { Component,PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Button} from 'react-materialize';
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

  componentDidMount() {

    this.costInput.focus();
  }

  render() {
    return (
      <table className="c-costs-add responsive">
        <tbody>
          <tr>
            <td>
              <DatePicker
                selected={this.state.date}
                onChange={this.selectDate} />
            </td>
            <td>
              <input type="text"                 
                defaultValue={this.state.cost}
                ref={(costInput)=>this.costInput=costInput}
                onChange={(e)=>{this.setState({cost: e.target.value})}} />
            </td>
            <td>
              <input type="text" 
                defaultValue={this.state.description} 
                onChange={(e)=>{this.setState({description: e.target.value})}} />
            </td>
            <td>
              <Button waves='light' floating icon='save' className='lightblue' onClick={()=>this.save()}></Button>
              <Button waves='light' floating icon='cancel' className="red" onClick={()=>this.cancel()}></Button>
            </td>
          </tr>
        </tbody>
      </table>
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

CostsAdd.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  
};

export default CostsAdd;
