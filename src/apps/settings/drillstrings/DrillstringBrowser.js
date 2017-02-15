import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringBrowser.css';

class DrillstringBrowser extends Component {

  render() {
    return <div className="c-drillstring-browser">
      <Grid fluid>
        <Row>
          <Col md={1}>
            Drillstring
          </Col>
          <Col md={10}>
            Dropdown
          </Col>
          <Col md={1}>
            <Button onClick={() => this.props.onNewDrillstring()}>Add</Button>
          </Col>
        </Row>
      </Grid>
    </div>;
  }

}

DrillstringBrowser.propTypes = {
  drillstrings: ImmutablePropTypes.list.isRequired,
  onNewDrillstring: PropTypes.func.isRequired
};

export default DrillstringBrowser;