import React, { Component, PropTypes } from 'react';
import { Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

class FluidCheckRheometerReadings extends Component {

  render() {
    return <div className="c-fluid-check-rheometer-readings">
      <h4>Rheometer Readings</h4>
      <Row>
        {this.renderField('rpm_600', '600 rpm')}
        {this.renderField('rpm_300', '300 rpm')}
      </Row>
      <Row>
        {this.renderField('rpm_200', '200 rpm')}
        {this.renderField('rpm_100', '100 rpm')}
      </Row>
      <Row>
        {this.renderField('rpm_6', '6 rpm')}
        {this.renderField('rpm_3', '3 rpm')}
      </Row>
    </div>;
  }

  renderField(name, label) {
    if (this.props.isEditable) {
      return <Input m={4}
                    label={label}
                    type="number"
                    defaultValue={this.getReading(name, '')}
                    onChange={e => this.props.onReadingChange(name, parseInt(e.target.value, 10))} />;
    } else {
      return [
        <Col m={1} key={`${name}-label`}>{label}</Col>,
        <Col m={2} key={`${name}-val`}>{this.getReading(name, '')}</Col>
      ];
    }
  }

  getReading(name, notSetValue) {
    return this.props.fluidCheck.getIn(['data', 'rheometer_readings', name], notSetValue);
  }

}

FluidCheckRheometerReadings.propTypes = {
  fluidCheck: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onReadingChange: PropTypes.func
};

export default FluidCheckRheometerReadings;