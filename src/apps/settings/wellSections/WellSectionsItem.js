import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';

import './WellSectionsItem.css';

class WellSectionsItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        name: record.getIn(["data","name"]) || "",
        top_depth: record.getIn(["data","top_depth"]),
        bottom_depth: record.getIn(["data","bottom_depth"])        
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

    let {name, top_depth, bottom_depth} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-wellsections-item">
        <td>{name}</td>
        <td>{this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").formatNumeral('0,0.00')}</td>
        <td>{this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-wellsections-item">
        <td>
          <Input type="text"
            s={12}
            label="Name"
            defaultValue={name}
            ref="name"
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{name:e.target.value})} )} />
        </td> 

        <td>
          <Input type="number" 
            s={12}
            label="Top Depth"
            error={this.state.errors.top_depth}
            defaultValue={top_depth? this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").formatNumeral('0,0.00') : top_depth}
            ref="top_depth"
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{top_depth:e.target.value})} )} />
        </td>

        <td>
          <Input type="number"
            s={12}
            label="Bottom Depth"
            error={this.state.errors.bottom_depth}
            defaultValue={bottom_depth? this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").formatNumeral('0,0.00'): bottom_depth}
            ref="bottom_depth"
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{bottom_depth:e.target.value})} )} />
        </td>
            
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
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
    let {name, top_depth, bottom_depth} = this.state.data;
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
    
    if (hasErrors) {
      this.setState({errors: errors});
      return;    
    }
    else {
      this.setState({errors:{}});
    }

    const record = this.props.record.update('data', (oldMap) => {
      return oldMap.set("top_depth",this.props.convert.convertValue(top_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("bottom_depth",this.props.convert.convertValue(bottom_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
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
