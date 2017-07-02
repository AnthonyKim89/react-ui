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

import './WellSectionsItem.css';

class WellSectionsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        name: record.getIn(["data", "name"]) || "",
        top_depth: record.getIn(["data", "top_depth"]),
        bottom_depth: record.getIn(["data", "bottom_depth"]),
        diameter: record.getIn(["data", "diameter"])
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
  }

  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["name"]).children[0].focus();
      this.fixPlaceholderIssue();
    }
  }
  
  render() {

    let {name, top_depth, bottom_depth, diameter} = this.state.data;

    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-wellsections-item" style={objTableRowStyle}>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn>{this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn>{this.props.convert.convertValue(parseFloat(diameter), "shortLength", "in").formatNumeral('0,0.00')}</TableRowColumn>
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
      <TableRow className="c-wellsections-item" style={objTableRowStyle}>
        <TableRowColumn>
          <TextField type="text" 
            floatingLabelText="Name"
            ref="name"
            value={name}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {name: e.target.value})} )} />
        </TableRowColumn> 

        <TableRowColumn>
          <TextField type="number" 
            floatingLabelText="Top Depth"
            errorText={this.state.errors.top_depth}
            ref="top_depth"
            value={top_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {top_depth: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn>
          <TextField type="number" 
            floatingLabelText="Bottom Depth"
            errorText={this.state.errors.bottom_depth}
            ref="bottom_depth"
            value={bottom_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {bottom_depth: e.target.value})} )} />
        </TableRowColumn>

        <TableRowColumn>
          <TextField type="number" 
            floatingLabelText="Diameter"
            errorText={this.state.errors.diameter}
            ref="diameter"
            value={diameter}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({}, this.state.data, {diameter: e.target.value})} )} />
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

  fixPlaceholderIssue() {    
    for (let ref in this.refs) {
      let refDom = ReactDOM.findDOMNode(this.refs[ref]);
      if (refDom.children[0].value === '0') {
        refDom.children[1].className="active";
      }      
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {      
      this.save(true);
    }
  }

  save(byKeyBoard) {
    let {name, top_depth, bottom_depth, diameter} = this.state.data;
    let hasErrors = false;
    let errors = {};

    if (isNaN(parseFloat(top_depth)) || parseFloat(top_depth) <0 ) {
      errors["top_depth"] = "Invalid Number";
      hasErrors = true;
    }

    if (isNaN(parseFloat(bottom_depth)) || parseFloat(bottom_depth) <0 ) {
      errors["bottom_depth"] = "Invalid Number";
      hasErrors = true;
    }
    
    if (isNaN(parseFloat(diameter)) || parseFloat(diameter) <0 ) {
      errors["diameter"] = "Invalid Number";
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
      return oldMap.set("top_depth", this.props.convert.convertValue(top_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("bottom_depth", this.props.convert.convertValue(bottom_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("diameter", this.props.convert.convertValue(diameter, "shortLength", this.props.convert.getUnitPreference("shortLength"), "in"))
        .set("name", name);
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

WellSectionsItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default WellSectionsItem;
