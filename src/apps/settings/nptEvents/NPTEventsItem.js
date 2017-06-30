import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentClear from 'material-ui/svg-icons/content/clear';
import moment from 'moment';

import './NPTEventsItem.css';

class NPTEventsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    console.log('record', record.getIn(["data","end_time"]));
    this.state = {
      data: {
        start_time: record.getIn(["data","start_time"])? moment.unix(record.getIn(["data","start_time"])).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm"),
        end_time: record.getIn(["data","end_time"])? moment.unix(record.getIn(["data","end_time"])).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm"),
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
    let {start_time, end_time, depth, type, comment} = this.state.data;
    
    const objStartDateTime = moment(start_time, "YYYY-MM-DDTHH:mm");

    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-npt-item" style={objTableRowStyle}>
        <TableRowColumn className="c-npt__starttime-column hide-on-med-and-down">{objStartDateTime.format('LLL')}</TableRowColumn>
        <TableRowColumn className="c-npt__endtime-column">
          {this.getTimeDiff()}
        </TableRowColumn>
        <TableRowColumn className="c-npt__depth-column hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(depth), "length", "ft").formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn className="c-npt__type-column">{type}</TableRowColumn>
        <TableRowColumn className="c-npt__comment-column hide-on-med-and-down">{comment}</TableRowColumn>
        <TableRowColumn className="c-npt__action-column hide-on-med-and-down">
          <FloatingActionButton className="view-action" mini={true} onClick={() => this.setState({editing: true})}>
            <EditorModeEdit />
          </FloatingActionButton>
          <FloatingActionButton className="view-action" mini={true} secondary={true} onClick={() => this.remove()}>
            <ContentRemove />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );

    return (
      <TableRow className="c-npt-item">
        <TableRowColumn className="c-npt__starttime-column hide-on-med-and-down">
          <TextField type="datetime-local" 
            floatingLabelText="Start Time"
            errorText={this.state.errors["start_time"]}
            value={start_time}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={this.startTimeChanged} />
        </TableRowColumn>

        <TableRowColumn className="c-npt__endtime-column">
          <TextField type="datetime-local" 
            floatingLabelText="End Time"
            errorText={this.state.errors["end_time"]}
            value={end_time}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={this.endTimeChanged} />
         
        </TableRowColumn>

        <TableRowColumn className="c-npt__depth-column hide-on-med-and-down">
          <TextField type="number" 
            hintText="Depth"
            floatingLabelText="Depth"
            errorText={this.state.errors.depth}
            ref="depth"
            value={depth? this.props.convert.convertValue(parseFloat(depth), "length", "ft").formatNumeral('0.00') : depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{depth:e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="c-npt__comment-column c-npt__type-column">
          <SelectField
            floatingLabelText="Type"
            value={type}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{type: e.target.value})} )}
          >
            <MenuItem value="" primaryText="Select Type"/>
            <MenuItem value="bit failure" primaryText="bit failure"/>
            <MenuItem value="motor failure" primaryText="motor failure"/>
            <MenuItem value="top drive failure" primaryText="top drive failure"/>
            <MenuItem value="pump failure" primaryText="pump failure"/>
            <MenuItem value="stuck drill pipe" primaryText="stuck drill pipe"/>
            <MenuItem value="stuck casing" primaryText="stuck casing"/>
            <MenuItem value="packoff" primaryText="packoff"/>
            <MenuItem value="washout" primaryText="washout"/>
            <MenuItem value="failed to reach build rate" primaryText="failed to reach build rate"/>
            <MenuItem value="MWD failure" primaryText="MWD failure"/>
            <MenuItem value="BOP issue" primaryText="BOP issue"/>
            <MenuItem value="weather delay" primaryText="weather delay"/>
            <MenuItem value="rig service" primaryText="rig service"/>
            <MenuItem value="geological sidetrack" primaryText="geological sidetrack"/>
            <MenuItem value="other" primaryText="other"/>
          </SelectField>
        </TableRowColumn>

        <TableRowColumn className="c-npt__comment-column hide-on-med-and-down">
          <TextField type="text" 
            hintText="comment"
            floatingLabelText="comment"
            defaultValue={comment}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{comment: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="c-npt__action-column hide-on-med-and-down">
          <FloatingActionButton className="view-action" mini={true} onClick={()=>this.save()}>
            <ContentSave />
          </FloatingActionButton>
          <FloatingActionButton className="view-action" mini={true} secondary={true} onClick={()=>this.cancelEdit()}>
            <ContentClear />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.save(true);
    }
  }

  save(byKeyBoard) {
    let {start_time, end_time, depth, type, comment} = this.state.data;
    let hasErrors = false;
    let errors = {};
    let strToday = moment(new Date()).format("YYYY-MM-DDTHH:mm");

    let matches = start_time.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/g);
    if (!matches) {
      errors["start_time"] = "e.g. " + strToday;
      hasErrors = true;
    }

    matches = end_time.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/g);
    if (!matches) {
      errors["end_time"] = "e.g. " + strToday;
      hasErrors = true;
    }

    const objStartDateTime = moment(start_time, "YYYY-MM-DDTHH:mm");
    const objEndDateTime = moment(end_time, "YYYY-MM-DDTHH:mm");

    if (!hasErrors && objStartDateTime.unix() > objEndDateTime.unix()) {
      errors["end_time"] = "Invalid end time.";
      hasErrors = true;
    }

    if (isNaN(parseFloat(depth)) || parseFloat(depth) <= 0 ) {
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
      return oldMap.set("start_time", objStartDateTime.unix())
        .set("end_time", objEndDateTime.unix())
        .set("type", type)
        .set("comment", comment)
        .set("depth", this.props.convert.convertValue(depth, "length", this.props.convert.getUnitPreference("length"), "ft"));
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

  startTimeChanged(e) {
    this.setState({
      data: Object.assign({}, this.state.data, {start_time: e.target.value})
    });
  }

  endTimeChanged(e) {
    this.setState({
      data: Object.assign({}, this.state.data, {end_time: e.target.value})
    });
  }

  getTimeDiff() {
    let {start_time, end_time} = this.state.data;
    
    const objStartDateTime = moment(start_time, "YYYY-MM-DDTHH:mm");
    const objEndDateTime = moment(end_time, "YYYY-MM-DDTHH:mm");

    let diff = objEndDateTime.diff(objStartDateTime);
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
