import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import { COMPONENT_FAMILIES } from './constants';

import './DrillstringComponentTableRow.css';

class DrillstringComponentTableRow extends Component {
  render() {        
    return <tr className="c-drillstring-component-table-row">
      <td>{this.renderComponentTextField('name')}</td>
      <td>{this.renderComponentSelectField('family', COMPONENT_FAMILIES)}</td>
      <td>{this.renderComponentNumberField('inner_diameter','shortLength','in')}</td>
      <td>{this.renderComponentNumberField('outer_diameter','shortLength','in')}</td>
      <td>{this.renderComponentNumberField('linear_weight','force','klbf')}</td>
      <td>{this.renderComponentNumberField('length','length','ft' )}</td>
      <td>{this.renderComponentNumberField('weight','mass','lb')}</td>
      <td>{this.renderComponentTextField('grade')}</td>
      <td>
        {this.props.isEditable &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteComponent()}></Button>}
      </td>
    </tr>;
  }

  renderComponentTextField(field) {
    if (this.props.isEditable) {
      return <Input type="text"
                    value={this.props.component.get(field, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)} />;
    } else {
      return this.props.component.get(field);
    }
  }

  renderComponentSelectField(field, options) {
    if (this.props.isEditable) {
      return <Input type="select"
                    value={this.props.component.get(field, '')}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)}>
        {options.map(({name, type}) =>
          <option key={type} value={type}>{name}</option>)}
      </Input>;
    } else {
      return this.props.component.get(field);
    }
  }

  renderComponentNumberField(field, unitType=null, unit=null) {
    let value = this.props.component.get(field, '');
    if (value!=='' && unitType && unit) {        
      value = this.props.convert.convertValue(value,unitType,unit).formatNumeral('0.0');
    }

    if (this.props.isEditable) {
      let family = this.props.component.get("family");      
      if (family ==='bit') {
        if (field === "linear_weight") {
          return "";
        }
        if (field === 'inner_diameter' || field ==='outer_diameter') {
          return <Input type="number"
            label=" "
            defaultValue={value}
            error={this.props.errors? this.props.errors[field]: null}
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={e => this.props.onComponentFieldChange(field,parseFloat(e.target.value))}/>;
        }
      }
      else {
        if (field==="weight") {
          return <label>
              {value}
            </label>;
        }
      }

      return <Input type="number"
                    label=" "
                    defaultValue={value}
                    ref={field}
                    error={this.props.errors? this.props.errors[field]: null}
                    onKeyPress={this.handleKeyPress.bind(this)}
                    onChange={e => this.onNumberFieldChange.bind(this)(field,parseFloat(e.target.value))} />;
    } else {
      return value;
    }
  }

  calcLinearWeight(id,od) {
    id = parseFloat(id);
    od = parseFloat(od);
    if (isNaN(id) || isNaN(od) || od<id) {
      return;
    }
    return 2.673*(od*od-id*id);
  }

  calcWeight(linearWeight,length) {
    linearWeight = parseFloat(linearWeight);
    length = parseFloat(length);
    if (isNaN(linearWeight) || isNaN(length)) {
      return;
    }
    return linearWeight*length;
  }

  onNumberFieldChange(field,value) {
    let id,od,linearWeight,length,weight;
    let nameValuePairs=[];
    value = isNaN(parseFloat(value))? value: parseFloat(value);    
    switch(field) {
      case 'inner_diameter':
        id = value;
        od = this.props.component.get('outer_diameter');
        length = this.props.component.get('length');
        linearWeight = this.calcLinearWeight(id,od);
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'outer_diameter':
        id = this.props.component.get('inner_diameter');
        od = value;        
        length = this.props.component.get('length');
        linearWeight = this.calcLinearWeight(id,od);
        weight = this.calcWeight(linearWeight,length);
        break;
      case 'linear_weight':
        length = this.props.component.get('length');
        weight = this.calcWeight(value,length);
        break;
      case 'length':
        linearWeight = this.props.component.get('linear_weight');
        weight = this.calcWeight(linearWeight,value);
        break;
      default:
        break;        
    }
    nameValuePairs=[{name:field,value}];

    if (linearWeight>=0) {
      nameValuePairs.push({name:"linear_weight", value: linearWeight});
      ReactDOM.findDOMNode(this.refs.linear_weight).children[0].value = numeral(linearWeight).format('0.0');
      ReactDOM.findDOMNode(this.refs.linear_weight).children[1].className="active";
    }

    if (weight) {
     nameValuePairs.push({name:"weight", value: weight}); 
    }
    this.props.onComponentMultiFieldsChange(nameValuePairs); 
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {      
      this.props.onSave();
    }
  }

}

DrillstringComponentTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  component: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onComponentFieldChange: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

export default DrillstringComponentTableRow;