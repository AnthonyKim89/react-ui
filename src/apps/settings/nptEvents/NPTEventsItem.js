import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import moment from 'moment';
import numeral from 'numeral';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './NPTEventsItem.css';

class NPTEventsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        start_time: record.getIn(["data","start_time"])? moment.unix(record.getIn(["data","start_time"])): moment(),
        end_time: record.getIn(["data","end_time"])? moment.unix(record.getIn(["data","end_time"])): moment(),
        depth: record.getIn(["data","depth"]),
        type: record.getIn(["data","type"]) || "",
        comment: record.getIn(["data","comment"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
    
    this.startTimeChanged = this.startTimeChanged.bind(this); 
    this.endTimeChanged = this.endTimeChanged.bind(this); 
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["depth"]).children[0].focus();
    }
  }

  render() {

    let {start_time,end_time,depth,type,comment} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-npt-item">
        <td className="hide-on-med-and-down">{start_time.format('LLL')}</td>
        <td>
          {this.getTimeDiff()}
        </td>
        <td className="hide-on-med-and-down">{numeral(this.props.convert.convertValue(parseFloat(depth), "length", "ft")).format('0,0.00')}</td>
        <td>{type}</td>
        <td className="hide-on-med-and-down">{comment}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-npt-item">
        <td className="hide-on-med-and-down">
           <Datetime defaultValue={start_time} onChange={this.startTimeChanged} />
        </td>

        <td>
          {this.state.errors["date range"]? 
            <div className='c-npt-item__error-wrapper'>
              <Datetime defaultValue={end_time} onChange={this.endTimeChanged} />
                <label> {this.state.errors["date range"]} </label> 
            </div> :

            <Datetime defaultValue={end_time} onChange={this.endTimeChanged} />
          }
        </td>

        <td className="hide-on-med-and-down">          
          <Input type="number" 
            s={12}
            label="Depth"
            error={this.state.errors.depth}
            ref="depth"
            defaultValue={depth? numeral(this.props.convert.convertValue(parseFloat(depth), "length", "ft")).format('0.00') : depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{depth: e.target.value})} )} />
        </td>

        <td>
          <Input type="select" 
            s={12}
            defaultValue={type}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{type: e.target.value})} )} >
            <option value="">Select Type</option>
            <option value="bit failure">bit failure</option>
            <option value="motor failure">motor failure</option>
            <option value="top drive failure">top drive failure</option>
            <option value="pump failure">pump failure</option>
            <option value="stuck drill pipe">stuck drill pipe</option>
            <option value="stuck casing">stuck casing</option>
            <option value="packoff">packoff</option>
            <option value="washout">washout</option>
            <option value="failed to reach build rate">failed to reach build rate</option>
            <option value="MWD failure">MWD failure</option>
            <option value="BOP issue">BOP issue</option>
            <option value="weather delay">weather delay</option>
            <option value="rig service">rig service</option>
            <option value="geological sidetrack">geological sidetrack</option>
            <option value="other">other</option>
          </Input>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            defaultValue={comment}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{comment: e.target.value})} )} />
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
    let {start_time,end_time,depth,type,comment} = this.state.data;
    let hasErrors = false;
    let errors = {};
    if (start_time.unix() > end_time.unix()) {
      errors["date range"] = "Invalid end time.";
      hasErrors = true;
    }

    if (isNaN(parseFloat(depth)) || parseFloat(depth) <=0 ) {
      errors["depth"] = "Invalid number.";
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
      return oldMap.set("start_time",start_time.unix())
        .set("end_time",end_time.unix())
        .set("type",type)
        .set("comment",comment)
        .set("depth",this.props.convert.convertValue(depth, "length", this.props.convert.getUnitPreference("length"), "ft"));
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

  startTimeChanged(newDateTime) {    
    this.setState({data: Object.assign({},this.state.data,{start_time:newDateTime})});
  }

  endTimeChanged(newDateTime) {    
    this.setState({data: Object.assign({},this.state.data,{end_time:newDateTime})});
  }

  getTimeDiff() {
    let {start_time,end_time} = this.state.data;
    let diff = end_time.diff(start_time);
    let duration = moment.duration(diff);
    let h = Math.floor(duration.asHours());
    let m = moment.utc(diff).format("m");
    
    let str="";
    if (h>0) {
      str = h+ " hrs ";
    }
    if (m>0) {
      str = str+ m + " mins";
    }
    return str;
  }

}

NPTEventsItem.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default NPTEventsItem;
