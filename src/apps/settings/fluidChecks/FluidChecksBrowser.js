import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Input } from 'react-materialize';
import { format as formatTime } from 'date-fns';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FluidCheckSummary from './FluidCheckSummary';
import FluidCheckRheometerReadings from './FluidCheckRheometerReadings';


class FluidChecksBrowser extends Component {

  render() {
    return <div className="c-fluid-checks-browser">
      <h4>Fluid Checks</h4>
      <Row>
        <Input m={11}
               label="Fluid Check"
               type="select"
               onChange={evt => this.onSelectChange(evt.target.value)}>
            {this.props.fluidChecks.map(ds =>
              <option key={ds.get('_id')} value={ds.get('_id')}>
                Date {formatTime(ds.get('timestamp') * 1000, 'ddd MMM Do YYYY')}
              </option>
            )}
        </Input>
        <Col m={1}>
          <Button floating large icon="add" onClick={() => this.props.onNewFluidCheck()} />
        </Col>
      </Row>
      {this.props.displayingFluidCheck &&
        <div>
          <FluidCheckSummary
            fluidCheck={this.props.displayingFluidCheck}
            isReadOnly={false}
            onEditFluidCheck={this.props.onEditFluidCheck}
            onDeleteFluidCheck={this.props.onDeleteFluidCheck} />
          <FluidCheckRheometerReadings
            fluidCheck={this.props.displayingFluidCheck}
            isEditable={false} />
        </div>}
    </div>;
  }

  onSelectChange(id) {
    this.props.onSelectFluidCheck(this.props.fluidChecks.find(ds => ds.get('_id') === id));
  }
}

FluidChecksBrowser.propTypes = {
  fluidChecks: ImmutablePropTypes.list.isRequired,
  displayingFluidCheck: ImmutablePropTypes.map,
  onSelectFluidCheck: PropTypes.func.isRequired,
  onNewFluidCheck: PropTypes.func.isRequired,
  onEditFluidCheck: PropTypes.func.isRequired,
  onDeleteFluidCheck: PropTypes.func.isRequired
};

export default FluidChecksBrowser;