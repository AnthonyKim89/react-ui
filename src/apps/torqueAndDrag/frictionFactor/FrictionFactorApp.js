import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import numeral from 'numeral';

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
    return <Row className="c-tnd-friction-factor__factor">
      <Col s={5} className="c-tnd-friction-factor__label">
        <label>{label}</label>
      </Col>
      <Col s={3}>
        <input type="number" className="c-tnd-friction-factor__input"
               value={numeral(this.getData().getIn(['data', 'current_usage', fieldName])).format("0.00")}
               onChange={() => {}}/>
      </Col>
      <Col s={4} className="c-tnd-friction-factor__predicted">
        *predicted {numeral(this.getData().getIn(['data', 'predicted', fieldName])).format("0.00")}
      </Col>
    </Row>;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates))
    );
  }

}

FrictionFactorApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default FrictionFactorApp;
