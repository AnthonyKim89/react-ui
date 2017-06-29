import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentClear from 'material-ui/svg-icons/content/clear';
import moment from 'moment';

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
    const today = new Date();
    const objTableRowStyle = {height: '70px'};

    if (!this.state.editing) return (
      <TableRow className="c-costs-item" style={objTableRowStyle}>
        <TableRowColumn className="c-costs__date-column">{date.format('L')}</TableRowColumn>
        <TableRowColumn className="c-costs__cost-column">{parseFloat(cost).formatNumeral('0,0.00')}</TableRowColumn>
        <TableRowColumn className="c-costs__description-column hide-on-med-and-down">{description}</TableRowColumn>
        <TableRowColumn className="c-costs__action-column hide-on-med-and-down">
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
      <TableRow className="c-costs-item" style={objTableRowStyle}>
        <TableRowColumn className="c-costs__date-column">
          <DatePicker name="costs_date" value={today} onChange={this.selectDate}/>
        </TableRowColumn>
        <TableRowColumn className="c-costs__cost-column">
          <TextField type="number" 
            hintText="cost"
            floatingLabelText="cost"
            errorText={this.state.errors.cost}
            ref="cost"
            defaultValue={cost}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{cost:e.target.value})} )} />
        </TableRowColumn>
        <TableRowColumn className="c-costs__description-column hide-on-med-and-down">
          <TextField type="text" 
            hintText="description"
            floatingLabelText="description"
            ref="description"
            defaultValue={description}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{description: e.target.value})} )} />
        </TableRowColumn>
        <TableRowColumn className="c-costs__action-column hide-on-med-and-down">
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

  /*handleKeyDown(e) {
    var nKeyCode = e.keyCode || e.charCode;
    var strCurrentValue = e.target.value;

    if( nKeyCode == 8 && strCurrentValue.indexOf('.') !== -1 && strCurrentValue.indexOf('.') === strCurrentValue.length - 2) {
      e.preventDefault();
      e.target.value = strCurrentValue.slice(0, -2);
    }
  }*/

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
