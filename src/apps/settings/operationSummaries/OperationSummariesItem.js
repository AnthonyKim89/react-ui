import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentClear from 'material-ui/svg-icons/content/clear';
import moment from 'moment';

import './OperationSummariesItem.css';

class OperationSummariesItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        date_time: record.getIn(["data", "date_time"])? moment.unix(record.getIn(["data", "date_time"])).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm"),
        user: record.getIn(["data","user"]),
        summary: record.getIn(["data","summary"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["summary"]).children[0].focus();
    }
  }

  render() {
    let {date_time, summary} = this.state.data;
    const objDateTime = moment(date_time, "YYYY-MM-DDTHH:mm");
    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-op-summaries-item" style={objTableRowStyle}>
        <TableRowColumn>{objDateTime.format('LLL')}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down"></TableRowColumn>        
        <TableRowColumn>{summary}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">
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
      <TableRow className="c-op-summaries-item" style={objTableRowStyle}>
        <TableRowColumn className="c-op-summaries__item-editing">
           <TextField type="text" 
            ref="date_time"
            floatingLabelText="Date Time"
            errorText={this.state.errors["date_time"]}
            defaultValue={date_time}
            onKeyPress={this.handleKeyPress.bind(this)} />
        </TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down c-op-summaries__item-editing"></TableRowColumn>
        <TableRowColumn className="c-op-summaries__item-editing">
          <TextField type="text" 
            ref="summary"
            floatingLabelText="Summary"
            value={summary}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {summary: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down c-op-summaries__item-editing">
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
    const date_time = this.refs.date_time.input.value;
    const summary = this.state.data.summary;
    const objDateTime = moment(new Date(date_time));
    let hasErrors = false;
    let errors = {};

    if (!objDateTime.isValid()) {
      errors["date_time"] = "Couldn't parse the date time.";
      hasErrors = true;
    }

    if (summary.length < 1) {
      errors["summary"] = "It should not be empty.";
      hasErrors = true;
    }

    if (hasErrors) {
      this.setState({errors: errors});
      return;    
    }
    else {
      this.setState({
        errors: {},
        data: Object.assign({}, this.state.data, {date_time: objDateTime.format("YYYY-MM-DDTHH:mm")})
      });
    }

    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("date_time", objDateTime.unix())
        .set("summary", summary);
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

}

OperationSummariesItem.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default OperationSummariesItem;
