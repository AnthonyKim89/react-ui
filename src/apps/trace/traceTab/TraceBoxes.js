import React, { Component, PropTypes } from 'react';
import { Button, Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import numeral from 'numeral';
import { find } from 'lodash';

import { SUPPORTED_TRACES } from '../constants';

import './TraceBoxes.css'

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
    return <div className="c-trace-boxes__box" key={index}>
      <Button flat className="c-trace-boxes__remove" onClick={() => this.props.onTraceRemoveRequested(index)}>
        <Icon>close</Icon>
      </Button>
      <div className="c-trace-boxes__label">{this.getTraceSpec(trace).label}</div>
      <div className="c-trace-boxes__value">{this.getTraceValue(trace)}</div>
      <div className="c-trace-boxes__unit">{this.getTraceSpec(trace).unit}</div>
    </div>;
  }

  getTraceSpec(trace) {
    return find(SUPPORTED_TRACES, {trace}) || {};
  }

  getTraceValue(trace) {
    return this.props.latestTraceRecord && numeral(this.props.latestTraceRecord.getIn(['data', trace])).format('0.0a');
  }

}

TraceBoxes.propTypes = {
  latestTraceRecord: ImmutablePropTypes.map,
  traces: ImmutablePropTypes.list.isRequired,
  onTraceAddRequested: PropTypes.func.isRequired,
  onTraceRemoveRequested: PropTypes.func.isRequired
};

export default TraceBoxes;
