import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { COMPONENT_FAMILIES } from './constants';

class DrillstringComponentTableRow extends Component {

  render() {
    return <tr>
      <td>{this.props.index + 1}</td>
      <td>{this.renderComponentTextField('name')}</td>
      <td>{this.renderComponentSelectField('family', COMPONENT_FAMILIES)}</td>
      <td>{this.renderComponentNumberField('inner_diameter')}</td>
      <td>{this.renderComponentNumberField('outer_diameter')}</td>
      <td>{this.renderComponentNumberField('length', 'length', 'ft')}</td>
      <td>{this.renderComponentNumberField('linear_weight', 'mass', 'lb')}</td>
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
      let value = this.props.component.get(field, '');
      if (unitType !== null) {
        value = this.props.convert.convertValue(parseFloat(value), unitType, unit).fixFloat(2);
      }
      return <Input type="number"
                    value={value}
                    onChange={e => this.props.onComponentFieldChange(field, parseFloat(e.target.value))} />;
    } else {
      return this.props.component.get(field);
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