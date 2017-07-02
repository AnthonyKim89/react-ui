import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { Map } from 'immutable';

import './CrewsContactItem.css';

class CrewsContactItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        name: record.getIn(["data","name"]) || "",
        phone: record.getIn(["data","phone"]) || "" ,
        shift: record.getIn(["data","shift"]) || "",
        rotation: record.getIn(["data","rotation"]) || "",
        position: record.getIn(["data","position"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["name"]).children[0].focus();
    }
  }

  render() {
    let {name, phone, shift, rotation, position} = this.state.data;
    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-crews-item" style={objTableRowStyle}>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{phone}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">{shift}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">{rotation}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">{position}</TableRowColumn>        
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

    if (!shift)
      shift = "__none__";

    return (
      <TableRow className="c-crews-item" style={objTableRowStyle}>
        <TableRowColumn>
          <TextField type="text" 
            floatingLabelText="name"
            ref="name"
            value={name}
            errorText={this.state.errors.name}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {name: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn>
          <TextField type="text" 
            floatingLabelText="Phone"
            value={phone}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {phone: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down">
          <SelectField
            floatingLabelText="Shift"
            value={shift}
            maxHeight={150}
            onChange={ (event, index, value) => this.setState({data: Object.assign({}, this.state.data, {shift: value})} )}
            >
            <MenuItem value={"__none__"} primaryText="Select Shift"/>
            <MenuItem value={"Day"} primaryText="Day"/>
            <MenuItem value={"Night"} primaryText="Night"/>
          </SelectField>
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down">
          <TextField type="text" 
            floatingLabelText="Rotation"
            value={rotation}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {rotation: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down">
          <TextField type="text" 
            floatingLabelText="Position"
            ref="position"
            value={position}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {position: e.target.value})} )} />
        </TableRowColumn>
        
        <TableRowColumn className="hide-on-med-and-down">
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
    let {name, phone, shift, rotation, position} = this.state.data;
    let hasErrors = false;
    let errors = {};
    if (name.length<1) {
      errors["name"] = "Invalid Name";
      hasErrors = true;
    }

    if (hasErrors) {
      this.setState({errors: errors});
      return;    
    }
    else {
      this.setState({errors:{}});
    }

    const record = this.props.record.update('data', (oldMap) => {
      return oldMap.set('name', name)
        .set('phone', phone)
        .set('shift', shift === "__none__" ? "" : shift)
        .set('rotation', rotation)
        .set('position', position);
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

CrewsContactItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default CrewsContactItem;
