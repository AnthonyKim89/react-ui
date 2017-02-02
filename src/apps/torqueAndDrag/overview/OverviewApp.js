import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import Gauge from '../../../common/Gauge';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './OverviewApp.css'

class OverviewApp extends Component {

  render() {
    return (
      <div className="c-tnd-overview">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Grid fluid>
            <Row>
              <Col md={6} xs={12}  className="c-tnd-overview__gauge">
                <h4 className="c-tnd-overview__gauge-title">Weight Transfer</h4>
                <Gauge widthCols={this.props.widthCols}
                       bands={this.getGaugeBands()}
                       value={this.getWeightTransferGaugeValue()} />
              </Col>
              <Col md={6} xs={12}  className="c-tnd-overview__gauge">
                <h4 className="c-tnd-overview__gauge-title">Drag</h4>
                <Gauge widthCols={this.props.widthCols}
                       bands={this.getGaugeBands()}
                       value={this.getDragGaugeValue()} />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
              </Col>
            </Row>
          </Grid> :
          <LoadingIndicator />}
      </div>
    );
  }

  getGaugeBands() {
    return {
      red:    {from: 0,  to: 10},
      yellow: {from: 10, to: 20},
      green:  {from: 20, to: 30}
    };
  }

  getWeightTransferGaugeValue() {
    return this.getGaugeValue(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'weight_transfer']));
  }

  getDragGaugeValue() {
    return this.getGaugeValue(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'drag', 'severity']));
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 5;
      case 'moderate': return 15;
      case 'high': return 25;
      default: return null;
    }
  }
}

OverviewApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OverviewApp;
