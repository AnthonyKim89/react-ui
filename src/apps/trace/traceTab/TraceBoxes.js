import React, { Component, PropTypes } from 'react';
import { Button, Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';
import { find } from 'lodash';

import { SUPPORTED_TRACES } from '../constants';

import './TraceBoxes.css';

class TraceBoxes extends Component {

  render() {
    return <div className="c-trace-boxes">
      <h5>Traces</h5>
      {this.props.traces.map((trace, idx) => this.renderBox(trace, idx))}
      <Button className="c-trace-boxes__add" onClick={() => this.props.onTraceAddRequested()}>
        Add Trace
      </Button>
    </div>;
  }

  renderBox(trace, index) {
    let traceSpec = this.getTraceSpec(trace);
    return <div className="c-trace-boxes__box" key={index}>
      <Button flat className="c-trace-boxes__remove" onClick={() => this.props.onTraceRemoveRequested(index)}>
        <Icon>close</Icon>
      </Button>
      <div className="c-trace-boxes__label">{traceSpec.label}</div>
      <div className="c-trace-boxes__value">{this.getTraceValue(trace, traceSpec)}</div>
      <div className="c-trace-boxes__unit">{this.getTraceDisplayUnit(traceSpec)}</div>
    </div>;
  }

  getTraceSpec(trace) {
    return find(SUPPORTED_TRACES, {trace}) || {};
  }

  getTraceValue(trace, spec) {
    let value = this.props.latestTraceRecord && this.props.latestTraceRecord.getIn(['data', trace]);
    if (value && spec.hasOwnProperty('unitType')) {
      value = this.props.convert.convertValue(value, spec.unitType, spec.cunit);
    }
    return numeral(value).format('0.0a');
  }

  getTraceDisplayUnit(spec) {
    let unitDisplay = spec.unit;
    if (spec.hasOwnProperty("unitType") && unitDisplay.includes("{u}")) {
      unitDisplay = unitDisplay.replace('{u}', this.props.convert.getUnitDisplay(spec.unitType));
    }
    return unitDisplay;
  }
}

TraceBoxes.propTypes = {
  latestTraceRecord: ImmutablePropTypes.map,
  traces: ImmutablePropTypes.list.isRequired,
  onTraceAddRequested: PropTypes.func.isRequired,
  onTraceRemoveRequested: PropTypes.func.isRequired
};

export default TraceBoxes;
