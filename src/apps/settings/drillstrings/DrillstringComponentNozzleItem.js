import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';

import { COMPONENT_FAMILIES } from './constants';

import './DrillstringComponentTableRow.css';

class DrillstringComponentNozzleItem extends Component {
  render() {        
    return <tr className="c-drillstring-component-nozzel-item">
     
      <td>{this.renderComponentNumberField('nozzle_size','shortLength','in')}</td>
      
      <td>
        {this.props.isEditable &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteComponent()}></Button>}
      </td>
    </tr>;
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
}
