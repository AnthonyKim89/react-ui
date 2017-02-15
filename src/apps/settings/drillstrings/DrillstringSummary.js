import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import { isNumber } from 'lodash';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringSummary.css';

export class DrillstringSummary extends Component {

  render() {
    return <div className="c-drillstring-summary">
      <Grid fluid>
        <Row>
          <Col md={2}>
            Drillstring/BHA
          </Col>
          <Col md={2}>
            Bit Size
          </Col>
          <Col md={2}>
            Tools
          </Col>
          <Col md={2}>
            Length (ft)
          </Col>
          <Col md={2}>
            Weight (klbs)
          </Col>
          <Col md={1}>
          </Col>
          <Col md={1}>
            {!this.props.isReadOnly &&
              <Button onClick={() => this.props.onEditDrillstring()}>Edit</Button>}
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            {this.props.drillstring.getIn(['data', 'id'])}
          </Col>
          <Col md={2}>
            {this.getBitSize()}
          </Col>
          <Col md={2}>
            {this.getComponentCount()}
          </Col>
          <Col md={2}>
            {this.getComponentLengthSum()}
          </Col>
          <Col md={2}>
            {this.getComponentWeightSum()}
          </Col>
        </Row>
      </Grid>
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
