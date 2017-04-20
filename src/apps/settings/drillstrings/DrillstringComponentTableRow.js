import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { COMPONENT_FAMILIES } from './constants';

import './DrillstringComponentTableRow.css';

class DrillstringComponentTableRow extends Component {
  render() {    
    return <tr className="c-drillstring-component-table-row">
      <td>{this.renderComponentTextField('name')}</td>
      <td>{this.renderComponentSelectField('family', COMPONENT_FAMILIES)}</td>
      <td>{this.renderComponentNumberField('inner_diameter')}</td>
      <td>{this.renderComponentNumberField('outer_diameter')}</td>
      <td>{this.renderComponentNumberField('linear_weight')}</td>
      <td>{this.renderComponentNumberField('length' )}</td>
      <td>{this.renderComponentNumberField('weight')}</td>
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
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)} />;
    } else {
      return this.props.component.get(field);
    }
  }

  renderComponentSelectField(field, options) {
    if (this.props.isEditable) {
      return <Input type="select"
                    value={this.props.component.get(field, '')}
                    onChange={e => this.props.onComponentFieldChange(field, e.target.value)}>
        {options.map(({name, type}) =>
          <option key={type} value={type}>{name}</option>)}
      </Input>;
    } else {
      return this.props.component.get(field);
    }
  }

  renderComponentNumberField(field, unitType=null, unit=null) {
    if (this.props.isEditable) {
      let family = this.props.component.get("family");
      let value = this.props.component.get(field, '');

      if (family ==='bit') {
        if (field === "linear_weight") {
          return "";
        }
        if (field === 'inner_diameter' || field ==='outer_diameter') {
          return <Input type="number"
            label=" "
            value={value}
            error={this.props.errors? this.props.errors[field]: null}
            onChange={e => this.props.onComponentFieldChange(field,e.target.value)}/>;
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
                    value={value}
                    error={this.props.errors? this.props.errors[field]: null}
                    onChange={e => this.onNumberFieldChange.bind(this)(field,e.target.value)} />;
    } else {
      return this.props.component.get(field);
    }
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
    }

    if (weight) {
     nameValuePairs.push({name:"weight", value: weight}); 
    }
    this.props.onComponentMultiFieldsChange(nameValuePairs); 
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
}

DrillstringComponentTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  component: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onComponentFieldChange: PropTypes.func.isRequired,
  onDeleteComponent: PropTypes.func.isRequired
};

export default DrillstringComponentTableRow;