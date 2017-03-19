import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import common from '../../../common';
import Convert from '../../../common/Convert';
import TraceTimeline from './TraceTimeline';
import TracePicker from './TracePicker';
import MultiTraceApp from '../multiTrace/MultiTraceApp';

import { DEFAULT_TRACE_GRAPHS } from './constants';

import './TraceTabApp.css'

class TraceTabApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tracePickerOpenFor: null
    };
    this.convert = new Convert();
  }
  render() {
    return <div className="c-trace-tab">
      <div className="c-trace-tab__timeline">
        <TraceTimeline data={this.props.data} />
      </div>
      {this.renderColumn(0)}
      {this.renderColumn(1)}
      {this.renderColumn(2)}
      {this.renderColumn(3)}
      <Modal
          isOpen={this.state.tracePickerOpenFor !== null}
          onRequestClose={() => this.closeTracePicker()}
          className='c-trace-picker'
          overlayClassName='c-trace-picker__overlay'
          contentLabel="Select Trace">
        <TracePicker
          trace={this.getTraceGraphs().get(this.state.tracePickerOpenFor)}
          onTraceChange={trace => this.setTraceGraph(this.state.tracePickerOpenFor, trace)} />
      </Modal>
    </div>;
  }

  renderColumn(colNumber) {
    const traces = this.getTraceGraphGoup(colNumber);
    return <div className="c-trace-tab__trace">
      <MultiTraceApp data={this.props.data}
                          trace1={traces.get(0)}
                          trace2={traces.get(1)}
                          trace3={traces.get(2)}
                          size={common.constants.Size.SMALL}
                          convert={this.convert}
                          widthCols={3}
                          isTraceChangeSupported={true}
                          onTraceChangeRequested={trace => this.openTracePicker(colNumber, trace)}>
      </MultiTraceApp>
    </div>;
  }

  openTracePicker(colNumber, trace) {
    const traceNumber = {trace1: 0, trace2: 1, trace3: 2}[trace];
    this.setState({tracePickerOpenFor: colNumber * 3 + traceNumber});
  }

  closeTracePicker() {
    this.setState({tracePickerOpenFor: null});
  }

  getTraceGraphGoup(number) {
    const allGraphs = this.getTraceGraphs();
    return Range(0, allGraphs.size, 3)
      .map(chunkStart => allGraphs.slice(chunkStart, chunkStart + 3))
      .get(number, List());
  }

  getTraceGraphs() {
    return this.props.traceGraphs || DEFAULT_TRACE_GRAPHS;
  }

  setTraceGraph(number, trace) {
    const newTraceGraphs = this.getTraceGraphs().set(number, trace);
    this.props.onSettingChange('traceGraphs', newTraceGraphs);
    this.closeTracePicker();
  }

}

TraceTabApp.propTypes = {
  data: ImmutablePropTypes.map,
  traceGraphs: ImmutablePropTypes.list,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired
};

export default TraceTabApp;
