import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './FrictionFactorApp.css'

class FrictionFactorApp extends Component {

  render() {
    return (
      <div className="c-tnd-friction-factor">
        {this.getData() ?
          <Grid fluid>
            {this.renderFactor('Casing', 'casing')}
            {this.renderFactor('Open Hole Slackoff', 'open_hole_slackoff')}
            {this.renderFactor('Open Hole Pickup', 'open_hole_pickup')}
          </Grid> :
          <LoadingIndicator />}
      </div>
    );
  }

  renderFactor(label, fieldName) {
    return <Row className="c-tnd-friction-factor__factor">
      <Col md={4}>
        <label>{label}</label>
      </Col>
      <Col md={4}>
        <input type="number"
               value={this.getData().getIn(['data', 'current_usage', fieldName])}
               onChange={() => {}}/>
      </Col>
      <Col md={4} className="c-tnd-friction-factor__predicted">
        *predicted {this.getData().getIn(['data', 'predicted', fieldName])}
      </Col>
    </Row>;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

}

FrictionFactorApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default FrictionFactorApp;
