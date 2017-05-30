import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import moment from 'moment';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './CostsItem.css';

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

  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["cost"]).children[0].focus();
    }
  }
  
  render() {

    let {date,cost,description} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-costs-item">
        <td>{date.format('L')}</td>
        <td>{parseFloat(cost).formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">{description}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-costs-item">
        <td>
          <Datetime 
            defaultValue={date} 
            onChange={this.selectDate} 
            dateFormat={false}/>
        </td>
        <td>
          <Input type="number" 
            s={12}
            label="cost"
            error={this.state.errors.cost}
            ref="cost"
            defaultValue={cost}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{cost:e.target.value})} )} />
        </td>
        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            label="description"
            ref="description"
            defaultValue={description}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{description: e.target.value})} )} />
        </td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
    );
  }


  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.save(true);
    }
  }

  save(byKeyBoard) {
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

    this.props.onSave(record, (!this.props.record.has("_id") && byKeyBoard));

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
