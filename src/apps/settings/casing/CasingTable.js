import React, { Component, PropTypes } from 'react';
import { Button, Input, Col, Row } from 'react-materialize';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './CasingTable.css';


class CasingTable extends Component {

  render() {
    return <div className="c-casing-table">
      <Row>
        <Col m={12}>
          <table>
            <thead>
              <tr>
                <th>I.D. (in)</th>
                <th>O.D. (in)</th>
                <th>Top Depth</th>
                <th>Bottom Depth</th>
                <th>Length</th>
                <th>Linear Mass</th>
                <th>Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.props.casing.getIn(['data', 'items'], List()).map((itm, idx) => 
                this.renderItem(itm, idx))}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col m={12}>
          {this.props.isEditable &&
            <Button floating icon="add" onClick={() => this.props.onAddItem()}></Button>}
        </Col>
      </Row>
    </div>;
  }

  renderItem(item, idx) {
    return <tr key={idx}>
      <td>{this.renderNumberField(item, idx, 'id')}</td>
      <td>{this.renderNumberField(item, idx, 'od')}</td>
      <td>{this.renderNumberField(item, idx, 'measured_depth_top', 'length', 'ft')}</td>
      <td>{this.renderNumberField(item, idx, 'measured_depth_bottom', 'length', 'ft')}</td>
      <td>{this.props.convert.ConvertValue(parseFloat(item.get('length')), 'length', 'ft').fixFloat(2)}</td>
      <td>{this.renderNumberField(item, idx, 'linear_mass', 'mass', 'lb')}</td>
      <td>{this.renderTextField(item, idx, 'grade')}</td>
      <td>
        {this.props.isEditable &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteItem(idx)}></Button>}
      </td>
    </tr>;
  }

  renderTextField(item, idx, field) {
    if (this.props.isEditable) {
      return <Input type="text"
                    value={item.get(field, '')}
                    onChange={e => this.props.onItemFieldChange(idx, field, e.target.value)} />;
    } else {
      return item.get(field);
    }
  }

  renderNumberField(item, idx, field, unitType=null, unit=null) {
    if (this.props.isEditable) {
      let value = item.get(field, '');
      if (unitType !== null) {
        value = this.props.convert.ConvertValue(parseFloat(value), unitType, unit).fixFloat(2);
      }
      return <Input type="number"
                    value={value}
                    onChange={e => this.props.onItemFieldChange(idx, field, parseFloat(e.target.value))} />;
    } else {
      return item.get(field);
    }
  }

}

CasingTable.propTypes = {
  casing: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onAddItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onItemFieldChange: PropTypes.func
};


export default CasingTable;