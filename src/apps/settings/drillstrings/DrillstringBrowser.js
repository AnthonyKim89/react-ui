import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DrillstringSummary from './DrillstringSummary';
import DrillstringComponentTable from './DrillstringComponentTable';

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
            <FormGroup controlId="bha">
              <FormControl
                componentClass="select"
                placeholder="select"
                onChange={evt => this.onSelectChange(evt.target.value)}>
                {this.props.drillstrings.map(ds =>
                  <option key={ds.get('_id')} value={ds.get('_id')}>
                    BHA #{ds.getIn(['data', 'id'])}
                  </option>
                )}
              </FormControl>
            </FormGroup>
          </Col>
          <Col md={1}>
            <Button onClick={() => this.props.onNewDrillstring()}>Add</Button>
          </Col>
        </Row>
      </Grid>
      {this.props.displayingDrillstring &&
        <div>
          <DrillstringSummary
            drillstring={this.props.displayingDrillstring}
            isReadOnly={false}
            onEditDrillstring={this.props.onEditDrillstring} />
          <DrillstringComponentTable
            drillstring={this.props.displayingDrillstring}
            isEditable={false} />
        </div>}
    </div>;
  }

  onSelectChange(id) {
    this.props.onSelectDrillstring(this.props.drillstrings.find(ds => ds.get('_id') === id));
  }
}

DrillstringBrowser.propTypes = {
  drillstrings: ImmutablePropTypes.list.isRequired,
  displayingDrillstring: ImmutablePropTypes.map,
  onSelectDrillstring: PropTypes.func.isRequired,
  onNewDrillstring: PropTypes.func.isRequired,
  onEditDrillstring: PropTypes.func.isRequired
};

export default DrillstringBrowser;