import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
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

    let {name,phone,shift,rotation,position} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-crews-item">
        <td>{name}</td>
        <td>{phone}</td>
        <td className="hide-on-med-and-down">{shift}</td>
        <td className="hide-on-med-and-down">{rotation}</td>
        <td className="hide-on-med-and-down">{position}</td>        
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-crews-item">
        <td>
          <Input type="text"
            s={12}
            label="Name"
            defaultValue={name}
            ref="name"
            error={this.state.errors.name}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{name: e.target.value})} )} />
        </td>

        <td>
          <Input type="text"
            s={12}
            label="Phone"
            defaultValue={phone}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{phone: e.target.value})} )} />
        </td>

        <td className="hide-on-med-and-down">
          <Input 
            s={12} 
            type='select' 
            defaultValue={shift}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{shift: e.target.value})} )}>
              <option value=''>Select Shift</option>
              <option value='Day'>Day</option>
              <option value='Night'>Night</option>
          </Input>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text"
            s={12}
            label="Rotation"
            defaultValue={rotation}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{rotation: e.target.value})} )} />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            label="Position"            
            defaultValue={position}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{position: e.target.value})} )} />
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
    let {name} = this.state.data;
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
      return Map(this.state.data);
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
