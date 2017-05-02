import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import numeral from 'numeral';

import './SurfaceEquipmentItem.css';

class SurfaceEquipmentItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        type: record.getIn(["data","type"]),
        block_weight: record.getIn(["data","block_weight"]),
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };
    
  }
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["block_weight"]).children[0].focus();
    }
  }

  render() {

    let {type,block_weight} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-surface-equipment-item">
        <td>{type}</td>
        <td>{numeral(block_weight).format('0,0.00')}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})} />
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-surface-equipment-item">
        <td>
          <Input type="select" 
            s={12}
            defaultValue={type}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{type: e.target.value})} )} >
            <option value="">Select Type</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="Type 3">Type 3</option>
            <option value="Type 4">Type 4</option>            
          </Input>
        </td>

        <td>
          <Input type="number" 
            s={12}
            label="Block Weight"
            defaultValue={numeral(block_weight).format('0')}
            ref="block_weight"            
            error={this.state.errors.block_weight}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{block_weight: parseFloat(e.target.value)})} )} />
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
      this.save();
    }
  }

  save() {
    let {type, block_weight} = this.state.data;
    let hasErrors = false;
    let errors = {};
   
    if (block_weight<0) {
      errors["block_weight"] = "It shuld be greater than 0.";
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
      return oldMap.set("type",type)
        .set("block_weight",block_weight);
    });

    console.log(record.toJS());

    this.props.onSave(record, false);

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

SurfaceEquipmentItem.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default SurfaceEquipmentItem;
