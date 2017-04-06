import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';
import { Map } from 'immutable';

import './CasingItem.css';

const MIN_ID = 0.7;
const MAX_ID = 100;
const MIN_OD = 1;
const MAX_OD = 100;
const MIN_TOP_DEPTH = -200;
const MAX_TOP_DEPTH = 30000;
const MIN_BOTTOM_DEPTH = -200;
const MAX_BOTTOM_DEPTH = 30000;


class CasingItem extends Component { 
  constructor(props) {
    super(props);
    const record = props.record;
    this.state = {
      data: {
        id: record.getIn(["data","id"]),
        od: record.getIn(["data","od"]),
        top_depth: record.getIn(["data","top_depth"]),
        bottom_depth: record.getIn(["data","bottom_depth"]),
        length: record.getIn(["data","length"]),
        linear_mass: record.getIn(["data","linear_mass"]),
        grade: record.getIn(["data","grade"])
      },
      editing: record.has("_id")? false : true,
      errors:{}
    };

    this.onCalcLinearMass = this.onCalcLinearMass.bind(this);    
    this.onCalcLength = this.onCalcLength.bind(this);    
  }
  
  render() {

    let {id,od,top_depth,bottom_depth,length,linear_mass,grade} = this.state.data;

    if (!this.state.editing) return (
      <tr className="c-casing-item">
        <td>{id}</td>
        <td>{od}</td>
        <td className="hide-on-med-and-down">{top_depth}</td>
        <td className="hide-on-med-and-down">{bottom_depth}</td>
        <td>{length}</td>
        <td className="hide-on-med-and-down">{linear_mass}</td>
        <td className="hide-on-med-and-down">{grade}</td>
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue view-action' waves='light' icon='edit'
                  onClick={() => this.setState({editing: true})}/>
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );

    return (
      <tr className="c-casing-item">
        <td>
          <Input type="number"
            s={12}
            label="I.D"
            defaultValue={id}
            error={this.state.errors.id}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{id: e.target.value})} )} 
            onBlur={this.onCalcLinearMass}/>
        </td>

        <td>
          <Input type="number"
            s={12}
            label="O.D"
            defaultValue={od}
            error={this.state.errors.od}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{od: e.target.value})} )} 
            onBlur={this.onCalcLinearMass}/>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Top Depth"
            defaultValue={top_depth}
            error={this.state.errors.top_depth}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{top_depth: e.target.value})} )} 
            onBlur={this.onCalcLength}/>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Bottom Depth"
            defaultValue={bottom_depth}
            error={this.state.errors.bottom_depth}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{bottom_depth: e.target.value})} )} 
            onBlur={this.onCalcLength}/>
        </td>

        <td>{length}</td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Linear Mass"
            defaultValue={this.state.data.linear_mass}
            ref="linearMassInput"
            error={this.state.errors.linear_mass}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{linear_mass: e.target.value})})} />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            label="Grade"            
            defaultValue={grade}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{grade: e.target.value})} )} />
        </td>
        
        <td className="hide-on-med-and-down">
          <Button floating className='lightblue' waves='light' icon='save' onClick={()=>this.save()} />
          <Button floating className='red' waves='light' icon='cancel' onClick={()=>this.cancelEdit()} />
        </td>
      </tr>
    );
  }

  isValidNumber(num,min,max) {
    num = parseFloat(num);
    if (isNaN(num)) {
      return false;
    }

    if (min && num<min) {
      return false;
    }

    if (max && num>max) {
      return false;
    }

    return true;
  }

  deriveLinearMass(id,od) {
    return 2.673*(od*od-id*id);
  }

  isValidLinearMass() {
    let {id,od,linear_mass} = this.state.data;
    id = parseFloat(id);
    od = parseFloat(od);
    linear_mass= parseFloat(linear_mass);

    let estimated = this.deriveLinearMass(id,od);
    if (linear_mass > estimated* 0.7 && linear_mass< estimated*1.3) {
      return true;
    }
    return false;
  }

  onCalcLinearMass() {
    let {id,od} = this.state.data;

    if (this.isValidNumber(id,MIN_ID,MAX_ID) && this.isValidNumber(od,MIN_OD,MAX_OD) && this.isValidNumber(id,MIN_ID,od)) {
      let calLW = this.deriveLinearMass(id,od);
      this.setState({data: Object.assign({},this.state.data,{linear_mass: calLW})});
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[0].value = calLW ;
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[1].className="active";
    }
    
  }

  onCalcLength() {
    let {top_depth,bottom_depth} = this.state.data;

    if (this.isValidNumber(top_depth,MIN_TOP_DEPTH,MAX_TOP_DEPTH) && this.isValidNumber(bottom_depth,MIN_BOTTOM_DEPTH,MAX_BOTTOM_DEPTH) && this.isValidNumber(top_depth,MIN_TOP_DEPTH,bottom_depth)) {
      this.setState({data: Object.assign({},this.state.data,{length: bottom_depth-top_depth})});
    }

  }

  hasFormErrors() {
    let {id,od,top_depth,bottom_depth,linear_mass} = this.state.data;

    let hasErrors = false;
    let errors = {};

    if (!this.isValidNumber(id,MIN_ID,MAX_ID)) {
      errors["id"] = `I.D must be ${MIN_ID}~${MAX_ID} in`;
      hasErrors = true;
    }

    if (!this.isValidNumber(od,MIN_OD,MAX_OD)) {
      errors["od"] = `O.D must be ${MIN_OD}~${MAX_OD} in`;
      hasErrors = true;
    }

    if (this.isValidNumber(id,MIN_ID,MAX_ID) && this.isValidNumber(od,MIN_OD,MAX_OD) && !this.isValidNumber(id,MIN_ID,od)) {
      errors["od"] = "O.D must be greater than I.D";
      hasErrors = true;      
    }
    
    if (!this.isValidNumber(top_depth,MIN_TOP_DEPTH,MAX_TOP_DEPTH)) {
      errors["top_depth"] = `Top depth must be in ${MIN_TOP_DEPTH}~${MAX_TOP_DEPTH} ft`;
      hasErrors = true;
    }

    if (!this.isValidNumber(bottom_depth,MIN_BOTTOM_DEPTH,MAX_BOTTOM_DEPTH)) {
      errors["bottom_depth"] = `Bottom Depth must be in ${MIN_BOTTOM_DEPTH} ~ ${MAX_BOTTOM_DEPTH} ft`;
      hasErrors = true;
    }

    if (this.isValidNumber(top_depth,MIN_TOP_DEPTH,MAX_TOP_DEPTH) && this.isValidNumber(bottom_depth,MIN_BOTTOM_DEPTH,MAX_BOTTOM_DEPTH) && !this.isValidNumber(top_depth,MIN_TOP_DEPTH,bottom_depth)) {
      errors["bottom_depth"] = "Bottom Depth must be greater than Top Depth";
      hasErrors = true;      
    }

    if (!this.isValidNumber(linear_mass,0)) {      
      errors["linear_mass"] = "Invalid Lineaer Mass";
      hasErrors = true;
    }

    if (!errors[id] && !errors[od] && !errors["linear_mass"]) {
      if (!this.isValidLinearMass()) {
        errors["linear_mass"] = "Not in range of 0.7*Estimated LW ~ 1..3* Estimated LW";
        hasErrors = true;
      }
    }

    
    this.setState({errors: errors});
    return hasErrors;
    

  }
  
  save() {

    if (this.hasFormErrors()) {
      return;
    }

    const record = this.props.record.update('data', (oldMap) => {
      return Map(this.state.data);
    });

    this.props.onSave(record);
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

CasingItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default CasingItem;
