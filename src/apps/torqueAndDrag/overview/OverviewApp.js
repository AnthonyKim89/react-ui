import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import Gauge from '../../../common/Gauge';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './OverviewApp.css'

class OverviewApp extends Component {

  render() {
    return (
      <div className="c-tnd-overview">
        {this.props.data && this.props.data.get(SUBSCRIPTIONS[0]) ?
          <Grid fluid>
            <Row>
              <Col md={6} xs={12}>
                <h3>Weight Transfer</h3>
                <Gauge widthCols={this.props.widthCols} />
              </Col>
              <Col md={6} xs={12}>
                <h3>Drag</h3>
                <Gauge widthCols={this.props.widthCols} />
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

}

OverviewApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OverviewApp;
