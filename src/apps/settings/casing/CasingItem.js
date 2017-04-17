import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button} from 'react-materialize';

import './CasingItem.css';

const MIN_ID = 0.7; //in
const MAX_ID = 100; //in
const MIN_OD = 1; //in
const MAX_OD = 100; //in
const MIN_TOP_DEPTH = -200; //ft
const MAX_TOP_DEPTH = 30000; //ft
const MIN_BOTTOM_DEPTH = -200; //ft
const MAX_BOTTOM_DEPTH = 30000; //ft


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

    //convert range value
    this.U_MIN_ID = props.convert.convertValue(MIN_ID,"shortLength","in");
    this.U_MAX_ID = props.convert.convertValue(MAX_ID,"shortLength","in");
    this.U_MIN_OD = props.convert.convertValue(MIN_OD,"shortLength","in");
    this.U_MAX_OD = props.convert.convertValue(MAX_OD,"shortLength","in");
    this.U_MIN_TOP_DEPTH = props.convert.convertValue(MIN_TOP_DEPTH,"length","ft");
    this.U_MAX_TOP_DEPTH = props.convert.convertValue(MAX_TOP_DEPTH,"length","ft");
    this.U_MIN_BOTTOM_DEPTH = props.convert.convertValue(MIN_BOTTOM_DEPTH,"length","ft");
    this.U_MAX_BOTTOM_DEPTH = props.convert.convertValue(MAX_BOTTOM_DEPTH,"length","ft");

    this.onCalcLinearMass = this.onCalcLinearMass.bind(this);
    this.onCalcLength = this.onCalcLength.bind(this);
  }
  
  render() {

    let {id,od,top_depth,bottom_depth,length,linear_mass,grade} = this.state.data;
    
    if (!this.state.editing) return (
      <tr className="c-casing-item">
        <td>{this.props.convert.convertValue(parseFloat(id), "shortLength", "in").fixFloat(2)}</td>
        <td>{this.props.convert.convertValue(parseFloat(od), "shortLength", "in").fixFloat(2)}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").fixFloat(2)}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").fixFloat(2)}</td>
        <td>{this.props.convert.convertValue(parseFloat(length), "length", "ft").fixFloat(2)}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(linear_mass), "force", "lbf").fixFloat(2)}</td>
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
            defaultValue={id? this.props.convert.convertValue(parseFloat(id), "shortLength", "in").fixFloat(2): id}
            error={this.state.errors.id}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{id: e.target.value})} )} 
            onBlur={this.onCalcLinearMass}/>
        </td>

        <td>
          <Input type="number"
            s={12}
            label="O.D"
            defaultValue={od? this.props.convert.convertValue(parseFloat(od), "shortLength", "in").fixFloat(2): od}
            error={this.state.errors.od}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{od: e.target.value})} )} 
            onBlur={this.onCalcLinearMass}/>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Top Depth"
            defaultValue={top_depth? this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").fixFloat(2): top_depth}
            error={this.state.errors.top_depth}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{top_depth: e.target.value})} )} 
            onBlur={this.onCalcLength}/>
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Bottom Depth"
            defaultValue={bottom_depth? this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").fixFloat(2): bottom_depth}
            error={this.state.errors.bottom_depth}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{bottom_depth: e.target.value})} )} 
            onBlur={this.onCalcLength}/>
        </td>

        <td>{length? this.props.convert.convertValue(parseFloat(length), "length", "ft").fixFloat(2): length}</td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Linear Mass"
            defaultValue={linear_mass? this.props.convert.convertValue(parseFloat(linear_mass), "force", "lbf").fixFloat(2): linear_mass}
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

    if (this.isValidNumber(id,this.U_MIN_ID,this.U_MAX_ID) && this.isValidNumber(od,this.U_MIN_OD,this.U_MAX_OD) && this.isValidNumber(id,this.U_MIN_ID,od)) {
      let calLW = this.deriveLinearMass(id,od);
      this.setState({data: Object.assign({},this.state.data,{linear_mass: calLW})});
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[0].value = calLW.fixFloat(2) ;
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[1].className="active";
    }
    
  }

  onCalcLength() {
    let {top_depth,bottom_depth} = this.state.data;

    if (this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && this.isValidNumber(bottom_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,bottom_depth)) {
      this.setState({data: Object.assign({},this.state.data,{length: bottom_depth-top_depth})});
    }

  }

  hasFormErrors() {

    let {id,od,top_depth,bottom_depth,linear_mass} = this.state.data;

    let hasErrors = false;
    let errors = {};

    let shortLengthUnitDisplay = this.props.convert.getUnitDisplay('shortLength');
    let lengthUnitDisplay = this.props.convert.getUnitDisplay('length');

    if (!this.isValidNumber(id,this.U_MIN_ID,this.U_MAX_ID)) {
      errors["id"] = `I.D must be ${this.U_MIN_ID}~${this.U_MAX_ID} ${shortLengthUnitDisplay}`;
      hasErrors = true;
    }

    if (!this.isValidNumber(od,this.U_MIN_OD,this.U_MAX_OD)) {
      errors["od"] = `O.D must be ${this.U_MIN_OD}~${this.U_MAX_OD} ${shortLengthUnitDisplay}`;
      hasErrors = true;
    }

    if (this.isValidNumber(id,this.U_MIN_ID,this.U_MAX_ID) && this.isValidNumber(od,this.U_MIN_OD,this.U_MAX_OD) && !this.isValidNumber(id,this.U_MIN_ID,od)) {
      errors["od"] = "O.D must be greater than I.D";
      hasErrors = true;      
    }
    
    if (!this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH)) {
      errors["top_depth"] = `Top depth must be in ${this.U_MIN_TOP_DEPTH}~${this.U_MAX_TOP_DEPTH} ${lengthUnitDisplay}`;
      hasErrors = true;
    }

    if (!this.isValidNumber(bottom_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH)) {
      errors["bottom_depth"] = `Bottom Depth must be in ${this.U_MIN_TOP_DEPTH} ~ ${this.U_MAX_TOP_DEPTH} ${lengthUnitDisplay}`;
      hasErrors = true;
    }

    if (this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && this.isValidNumber(bottom_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && !this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,bottom_depth)) {
      errors["bottom_depth"] = "Bottom Depth must be greater than Top Depth";
      hasErrors = true;      
    }

    if (!this.isValidNumber(linear_mass,0)) {
      errors["linear_mass"] = "Invalid Linear Mass";
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

    let {id,od,top_depth,bottom_depth,length,linear_mass,grade} = this.state.data;

    const record = this.props.record.update('data', (oldMap) => {      
      return oldMap.set("id",this.props.convert.convertValue(id, "shortLength", this.props.convert.getUnitPreference("shortLength"), "in"))
        .set("od",this.props.convert.convertValue(od, "shortLength", this.props.convert.getUnitPreference("shortLength"), "in"))
        .set("top_depth",this.props.convert.convertValue(top_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("bottom_depth",this.props.convert.convertValue(bottom_depth, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("length",this.props.convert.convertValue(length, "length", this.props.convert.getUnitPreference("length"), "ft"))
        .set("linear_mass",this.props.convert.convertValue(linear_mass, "force", this.props.convert.getUnitPreference("force"), "lbf"))
        .set("grade",grade);
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