import React, { Component, PropTypes } from 'react';
import { format as formatDate } from 'date-fns';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './FluidCheckSummary.css';

export class FluidCheckSummary extends Component {

  render() {
    return <div className="c-fluid-check-summary">
      <Row>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Density (ppg)</div>
          <div className="c-drillstring-summary__value">
            {this.props.record.getIn(['data', 'mud_density'])}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Funnel Viscosity (s)</div>
          <div className="c-drillstring-summary__value">
            {this.props.record.getIn(['data', 'plastic_viscosity'])}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">PV</div>
          <div className="c-drillstring-summary__value">
            {this.props.record.getIn(['data', 'PV'])}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">YP</div>
          <div className="c-drillstring-summary__value">
            {this.props.record.getIn(['data', 'YP'])}
          </div>
        </Col>
        <Col m={1}>
        </Col>
        <Col m={1}>
          {!this.props.isReadOnly &&
            <Button floating large icon="mode_edit" onClick={() => this.props.onEditRecord()}></Button>}
          {this.props.record.get('_id') &&
            <Button floating large icon="delete" className="red" onClick={() => this.props.onDeleteRecord()}></Button>}
        </Col>
      </Row>
      {!this.props.isReadOnly &&
        <Row>
          <Col m={2} className="c-fluid-check-summary__footer-value">
            {this.getTimestamp()}
          </Col>
        </Row>}
    </div>;
  }

  getTimestamp() {
    return formatDate(this.props.record.get('timestamp') * 1000, 'ddd MMM Do YYYY');
  }

}

FluidCheckSummary.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onEditRecord: PropTypes.func,
  onDeleteRecord: PropTypes.func.isRequired
};

export default FluidCheckSummary;
