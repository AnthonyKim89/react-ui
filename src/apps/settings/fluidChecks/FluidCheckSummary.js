import React, { Component, PropTypes } from 'react';
import { format as formatDate } from 'date-fns';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './FluidCheckSummary.css';

export class FluidCheckSummary extends Component {

  render() {
    return <div className="c-fluid-check-summary">
      <Row>
        <Col m={6} s={12}>
          <div className="c-fluid-check-summary__label">Mud type</div>
          <div className="c-fluid-check-summary__value--is-long">
            {this.props.record.getIn(['data', 'mud_type'])}
          </div>
        </Col>

        <Col m={6} s={12}>
          <div className="c-fluid-check-summary__label">Density</div>
          <div className="c-fluid-check-summary__value">
            {this.props.record.getIn(['data', 'mud_density'])}
          </div>
        </Col>              
      </Row>

      <div className="c-fluid-check-summary__actions">
        {!this.props.isReadOnly &&
          <Button floating icon="mode_edit" onClick={() => this.props.onEditRecord()}></Button>}        
        {this.props.record.get('_id') &&
          <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteRecord()}></Button>}
      </div>
      
      
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
