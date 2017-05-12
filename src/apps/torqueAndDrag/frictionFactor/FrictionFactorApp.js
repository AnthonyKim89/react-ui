import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './FrictionFactorApp.css';

class FrictionFactorApp extends Component {

  render() {
    return (
      <div className="c-tnd-friction-factor">
        {this.getData() ?
          <div className="c-tnd-friction-factor__factor-box">
            {this.renderFactor('Casing', 'casing')}
            {this.renderFactor('Open Hole Slackoff', 'open_hole_slackoff')}
            {this.renderFactor('Open Hole Pickup', 'open_hole_pickup')}
          </div> :
          <LoadingIndicator />}
      </div>
    );
  }

  renderFactor(label, fieldName) {
    let current = this.getData().getIn(['data', 'current_usage', fieldName]) || 0;
    let predicted = this.getData().getIn(['data', 'predicted', fieldName]) || 0;
    return <Row className="c-tnd-friction-factor__factor">
      <Col s={5} className="c-tnd-friction-factor__label">
        <label>{label}</label>
      </Col>
      <Col s={3}>
        <input type="number" className="c-tnd-friction-factor__input"
               defaultValue={current.formatNumeral("0.00")}/>
      </Col>
      <Col s={4} className="c-tnd-friction-factor__predicted">
        *predicted {predicted.formatNumeral("0.00")}
      </Col>
    </Row>;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates);
  }

}

FrictionFactorApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default FrictionFactorApp;
