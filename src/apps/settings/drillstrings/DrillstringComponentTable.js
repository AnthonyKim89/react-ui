import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-materialize';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringComponentTable.css';

class DrillstringComponentTable extends Component {

  render() {
    return <div className="c-drillstring-component-table">
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Family</th>
            <th>ID (in)</th>
            <th>OD (in)</th>
            <th>Length (ft)</th>
            <th>Weight (lbs)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.drillstring.getIn(['data', 'components'], List()).map((cmp, idx) => 
            this.renderComponent(cmp, idx))}
        </tbody>
      </table>
      {this.props.isEditable &&
        <Button floating icon="add" onClick={() => this.props.onAddComponent()}></Button>}
    </div>;
  }

  renderComponent(component, idx) {
    return <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{this.renderComponentTextField(component, idx, 'name')}</td>
      <td>{this.renderComponentTextField(component, idx, 'type')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'inner_diameter')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'outer_diameter')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'length')}</td>
      <td>{this.renderComponentNumberField(component, idx, 'linear_weight')}</td>
      <td>
        {this.props.isEditable &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteComponent(idx)}></Button>}
      </td>
    </tr>;
  }

  renderComponentTextField(component, idx, field) {
    if (this.props.isEditable) {
      return <Input
        type="text"
        value={component.get(field, '')}
        onChange={e => this.props.onComponentFieldChange(idx, field, e.target.value)} />
    } else {
      return component.get(field);
    }
  }

  renderComponentNumberField(component, idx, field) {
    if (this.props.isEditable) {
      return <Input
        type="number"
        value={component.get(field, '')}
        onChange={e => this.props.onComponentFieldChange(idx, field, parseFloat(e.target.value))} />
    } else {
      return component.get(field);
    }
  }

}

DrillstringComponentTable.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onAddComponent: PropTypes.func,
  onDeleteComponent: PropTypes.func,
  onComponentFieldChange: PropTypes.func
};

export default DrillstringComponentTable;