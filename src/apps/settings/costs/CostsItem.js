import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class CostsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        date: record.getIn(["data","date"])? moment.unix(record.getIn(["data","date"])) : moment(),
        cost: record.getIn(["data","cost"]) ,
        description: record.getIn(["data","description"]) || "",
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
   
    this.selectDate = this.selectDate.bind(this); 
  }
  
  render() {

    let {date,cost,description} = this.state.data;

    if (!this.state.editing) return (
      <tr>
        <td>{date.format('L')}</td>
        <td>{cost}</td>
        <td>{description}</td>
        <td>
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr>
        <td>
          <DatePicker
            selected={date}
            onChange={this.selectDate} />
        </td>
        <td>
          <Input type="number" 
            s={12}
            label="cost"
            error={this.state.errors.cost}
            defaultValue={cost}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{cost:e.target.value})} )} />
        </td>
        <td>
          <Input type="text" 
            s={12}
            label="description"
            defaultValue={description}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{description: e.target.value})} )} />
        </td>
        <td>
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
    );
  }

  save() {

    let {date,cost,description} = this.state.data;
    
    if (isNaN(parseFloat(cost)) || parseFloat(cost) <=0 ) {
      this.setState({errors: Object.assign({},this.state.errors,{cost:"Invalid number."}) });
      return;
    }

    this.setState({errors:{}});

    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("date",date.unix())
        .set("cost",parseFloat(cost))
        .set("description",description);
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

  selectDate(newDate) {
    this.setState({data: Object.assign({},this.state.data,{date:newDate})});
  }

}

CostsItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default CostsItem;
