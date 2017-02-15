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
          <Col md={1}>
            Drillstring/BHA
          </Col>
          <Col md={1}>
            Bit Size
          </Col>
          <Col md={1}>
            Tools
          </Col>
          <Col md={1}>
            Length (ft)
          </Col>
          <Col md={1}>
            Weight (klbs)
          </Col>
          <Col md={7}>
            <Button onClick={() => this.props.onEditDrillstring()}>Edit</Button>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            {this.props.drillstring.getIn(['data', 'id'])}
          </Col>
          <Col md={1}>
            {this.getBitSize()}
          </Col>
          <Col md={1}>
            {this.getComponentCount()}
          </Col>
          <Col md={1}>
            {this.getComponentLengthSum()}
          </Col>
          <Col md={1}>
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
      .reduce((sum, i) => sum + i, 0);
  }
  
  getComponentWeightSum() {
    return this.getComponents()
      .map(c => c.get('linear_weight'))
      .filter(isNumber)
      .reduce((sum, i) => sum + i, 0);
  }

  getComponents() {
    return this.props.drillstring.getIn(['data', 'components'], List())
  }

}

DrillstringSummary.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  onEditDrillstring: PropTypes.func.isRequired
};

export default DrillstringSummary;
