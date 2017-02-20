import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import { isNumber } from 'lodash';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringSummary.css';

export class DrillstringSummary extends Component {

  render() {
    return <div className="c-drillstring-summary">
      <Row>
        <Col m={2}>
          Drillstring/BHA
        </Col>
        <Col m={2}>
          Bit Size
        </Col>
        <Col m={2}>
          Tools
        </Col>
        <Col m={2}>
          Length (ft)
        </Col>
        <Col m={2}>
          Weight (klbs)
        </Col>
        <Col m={1}>
        </Col>
        <Col m={1}>
          {!this.props.isReadOnly &&
            <Button floating large icon="mode_edit" onClick={() => this.props.onEditDrillstring()}></Button>}
        </Col>
      </Row>
      <Row>
        <Col m={2}>
          {this.props.drillstring.getIn(['data', 'id'])}
        </Col>
        <Col m={2}>
          {this.getBitSize()}
        </Col>
        <Col m={2}>
          {this.getComponentCount()}
        </Col>
        <Col m={2}>
          {this.getComponentLengthSum()}
        </Col>
        <Col m={2}>
          {this.getComponentWeightSum()}
        </Col>
      </Row>
    </div>;
  }

  getBitSize() {
    return this.getComponents()
      .find(c => c.get('name') === 'Bit', null, Map())
      .get('size');
  }

  getComponentCount() {
    return this.getComponents().size;
  }

  getComponentLengthSum() {
    return this.getComponents()
      .map(c => c.get('length'))
      .filter(isNumber)
      .reduce((sum, length) => sum + length, 0);
  }
  
  getComponentWeightSum() {
    return this.getComponents()
      .map(c => c.get('linear_weight'))
      .filter(isNumber)
      .reduce((sum, weight) => sum + weight, 0);
  }

  getComponents() {
    return this.props.drillstring.getIn(['data', 'components'], List())
  }

}

DrillstringSummary.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onEditDrillstring: PropTypes.func
};

export default DrillstringSummary;
