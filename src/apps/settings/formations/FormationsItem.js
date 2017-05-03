import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';

import './FormationsItem.css';

class FormationsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        td: record.getIn(["data","td"]),
        md: record.getIn(["data","md"]) ,
        formation_name: record.getIn(["data","formation_name"]) || "",
        lithology: record.getIn(["data","lithology"]) || ""
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["td"]).children[0].focus();
    }
  }

  render() {

    let {td,md,formation_name,lithology} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-formations-item">
        <td>{this.props.convert.convertValue(parseFloat(td), "length", "ft").formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(md), "length", "ft").formatNumeral('0,0.00')}</td>
        <td>{formation_name}</td>
        <td className="hide-on-med-and-down">{lithology}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-formations-item">
        <td>
          <Input type="number" 
            s={12}
            label="True Vertical Depth"
            error={this.state.errors.td}
            defaultValue={td? this.props.convert.convertValue(parseFloat(td), "length", "ft").formatNumeral('0.00') : td}
            ref="td"
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{td:e.target.value})} )} />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Measured Depth (ft)"
            error={this.state.errors.md}
            defaultValue={md? this.props.convert.convertValue(parseFloat(md), "length", "ft").formatNumeral('0.00'): md}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{md:e.target.value})} )} />
        </td>

        <td>
          <Input type="text"
            s={12}
            label="Formation Name"
            defaultValue={formation_name}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{formation_name:e.target.value})} )} />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            label="Lithology"
            defaultValue={lithology}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{lithology:e.target.value})} )} />
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
    let {td,md,formation_name,lithology} = this.state.data;
    let hasErrors = false;
    let errors = {};
    if (isNaN(parseFloat(td)) || parseFloat(td) <0 ) {
      errors["td"] = "Invalid Number";
      hasErrors = true;
    }

    if (isNaN(parseFloat(md)) || parseFloat(md) <0 ) {
      errors["md"] = "Invalid Number";
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
      return oldMap.set("td",this.props.convert.convertValue(td, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("md",this.props.convert.convertValue(md, "length", this.props.convert.getUnitPreference("length"), "ft"))
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
