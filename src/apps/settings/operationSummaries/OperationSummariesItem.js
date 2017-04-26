import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import moment from 'moment';

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './OperationSummariesItem.css';

class OperationSummariesItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        date_time: record.getIn(["data","date_time"])? moment.unix(record.getIn(["data","date_time"])): moment(),
        user: record.getIn(["data","user"]),
        summary: record.getIn(["data","summary"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
    
    this.dateTimeChanged = this.dateTimeChanged.bind(this);
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["summary"]).children[0].focus();
    }
  }

  render() {

    let {date_time,summary} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-op-summaries-item">
        <td>{date_time.format('LLL')}</td>
        <td className="hide-on-med-and-down"></td>        
        <td>{summary}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-op-summaries-item">
        <td>
           <Datetime defaultValue={date_time} onChange={this.dateTimeChanged} />
        </td>
        <td className="hide-on-med-and-down"></td>
        <td>
          <Input type="text" 
            s={12}
            label="Summary"
            defaultValue={summary}
            ref="summary"            
            error={this.state.errors.summary}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{summary: e.target.value})} )} />
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
    let {date_time, summary} = this.state.data;
    let hasErrors = false;
    let errors = {};
   
    if (summary.length<1) {
      errors["summary"] = "It should not be empty.";
      hasErrors = true;
    }

    if (hasErrors) {
      this.setState({errors: errors});
      return;    
    }
    else {
      this.setState({errors:{}});
    }

    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("date_time",date_time.unix())
        .set("summary",summary);
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

  dateTimeChanged(newDateTime) {    
    this.setState({data: Object.assign({},this.state.data,{date_time:newDateTime})});
  }

}

OperationSummariesItem.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default OperationSummariesItem;
