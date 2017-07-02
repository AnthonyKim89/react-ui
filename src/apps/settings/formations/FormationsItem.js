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

import './FormationsItem.css';

class FormationsItem extends Component { 
  constructor(props) {
    super(props);
    
    const record = props.record;

    this.state = {
      data: {
        true_vertical_depth: record.getIn(["data", "td"]),
        measured_depth: record.getIn(["data", "md"]) ,
        formation_name: record.getIn(["data", "formation_name"]) || "",
        lithology: record.getIn(["data", "lithology"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["true_vertical_depth"]).children[0].focus();
    }
  }

  render() {

    let {true_vertical_depth, measured_depth, formation_name, lithology} = this.state.data;

    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-formations-item" style={objTableRowStyle}>
        <TableRowColumn>{this.props.convert.convertValue(parseFloat(true_vertical_depth), "length", "ft").formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(measured_depth), "length", "ft").formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn>{formation_name}</TableRowColumn>
        <TableRowColumn className="hide-on-med-and-down">{lithology}</TableRowColumn>
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
      <TableRow className="c-formations-item" style={objTableRowStyle}>
        <TableRowColumn>
          <TextField type="number" 
            floatingLabelText="True Vertical Depth"
            errorText={this.state.errors.true_vertical_depth}
            ref="true_vertical_depth"
            value={true_vertical_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {true_vertical_depth: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down">
          <TextField type="number" 
            floatingLabelText="Measured Depth"
            errorText={this.state.errors.measured_depth}
            ref="measured_depth"
            value={measured_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {measured_depth: e.target.value})} )} />/>
        </TableRowColumn>

        <TableRowColumn>
          <TextField type="text" 
            floatingLabelText="Formation Name"
            ref="formation_name"
            value={formation_name}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {formation_name: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn className="hide-on-med-and-down">
          <TextField type="text" 
            floatingLabelText="Lithology"
            ref="lithology"
            value={lithology}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {lithology: e.target.value})} )} />
        </TableRowColumn>
        
        <TableRowColumn className="hide-on-med-and-down">
          <FloatingActionButton className="view-action" mini={true} onClick={() => this.save()}>
            <ContentSave />
          </FloatingActionButton>
          <FloatingActionButton className="view-action" mini={true} secondary={true} onClick={() => this.cancelEdit()}>
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
    let {true_vertical_depth, measured_depth, formation_name, lithology} = this.state.data;
    let hasErrors = false;
    let errors = {};
    if (isNaN(parseFloat(true_vertical_depth)) || parseFloat(true_vertical_depth) <0 ) {
      errors["true_vertical_depth"] = "Invalid Number";
      hasErrors = true;
    }

    if (isNaN(parseFloat(measured_depth)) || parseFloat(measured_depth) <0 ) {
      errors["measured_depth"] = "Invalid Number";
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
      return oldMap.set("td",this.props.convert.convertValue(true_vertical_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("md",this.props.convert.convertValue(measured_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("formation_name", formation_name)
        .set("lithology", lithology);
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

FormationsItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default FormationsItem;
