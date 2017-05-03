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
  
  componentDidMount() {
    if (this.state.editing) {
      ReactDOM.findDOMNode(this.refs["i_d"]).children[0].focus();
    }
  }

  render() {

    let {id,od,top_depth,bottom_depth,length,linear_mass,grade} = this.state.data;
    
    if (!this.state.editing) return (
      <tr className="c-casing-item">
        <td>{this.props.convert.convertValue(parseFloat(id), "shortLength", "in").formatNumeral('0,0.00')}</td>
        <td>{this.props.convert.convertValue(parseFloat(od), "shortLength", "in").formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").formatNumeral('0,0.00')}</td>
        <td>{this.props.convert.convertValue(parseFloat(length), "length", "ft").formatNumeral('0,0.00')}</td>
        <td className="hide-on-med-and-down">{this.props.convert.convertValue(parseFloat(linear_mass), "force", "klbf").formatNumeral('0,0.00')}</td>
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
            defaultValue={id? this.props.convert.convertValue(parseFloat(id), "shortLength", "in").formatNumeral('0.00'): id}
            ref="i_d"
            error={this.state.errors.id}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{id: e.target.value})}, this.onCalcLinearMass )} 
            />
        </td>

        <td>
          <Input type="number"
            s={12}
            label="O.D"
            defaultValue={od? this.props.convert.convertValue(parseFloat(od), "shortLength", "in").formatNumeral('0.00'): od}
            error={this.state.errors.od}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{od: e.target.value})}, this.onCalcLinearMass )} 
            />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Top Depth"
            defaultValue={top_depth? this.props.convert.convertValue(parseFloat(top_depth), "length", "ft").formatNumeral('0.00') : top_depth}
            error={this.state.errors.top_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{top_depth: e.target.value})}, this.onCalcLength) } 
            />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Bottom Depth"
            defaultValue={bottom_depth? this.props.convert.convertValue(parseFloat(bottom_depth), "length", "ft").formatNumeral('0.00'): bottom_depth}
            error={this.state.errors.bottom_depth}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{bottom_depth: e.target.value})}, this.onCalcLength )} 
            />
        </td>

        <td>{length? this.props.convert.convertValue(parseFloat(length), "length", "ft").formatNumeral('0,0.00'): length}</td>

        <td className="hide-on-med-and-down">
          <Input type="number"
            s={12}
            label="Linear Mass"
            defaultValue={linear_mass? this.props.convert.convertValue(parseFloat(linear_mass), "force", "klbf").formatNumeral('0.00'): linear_mass}
            ref="linearMassInput"
            error={this.state.errors.linear_mass}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.setState({data: Object.assign({},this.state.data,{linear_mass: e.target.value})})} />
        </td>

        <td className="hide-on-med-and-down">
          <Input type="text" 
            s={12}
            label="Grade"            
            defaultValue={grade}
            onKeyPress={this.handleKeyPress.bind(this)}
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
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[0].value = calLW.formatNumeral('0.00');
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[1].className="active";
    }
    else {
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[0].value = "";
      ReactDOM.findDOMNode(this.refs.linearMassInput).children[1].className="";
      this.setState({data: Object.assign({},this.state.data,{linear_mass: null})});
    }
    
  }

  onCalcLength() {
    let {top_depth,bottom_depth} = this.state.data;      
    if (this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && this.isValidNumber(bottom_depth,this.U_MIN_TOP_DEPTH,this.U_MAX_TOP_DEPTH) && this.isValidNumber(top_depth,this.U_MIN_TOP_DEPTH,bottom_depth)) {
      this.setState({data: Object.assign({},this.state.data,{length: bottom_depth-top_depth})});
    }
    else {
      this.setState({data: Object.assign({},this.state.data,{length: null})});    
    }
  }

  hasFormErrors() {

    let {id,od,top_depth,bottom_depth,length,linear_mass} = this.state.data;

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

    if (!this.isValidNumber(length,0)) {
      errors["length"] = "Invalid Length";
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
  
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.save(true);
    }
  }

  save(byKeyBoard) {
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
        .set("linear_mass",this.props.convert.convertValue(linear_mass, "force", this.props.convert.getUnitPreference("force"), "klbf"))
        .set("grade",grade);
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

CasingItem.propTypes = {
  
  record: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  
};

export default CasingItem;
