import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import common from '../../../common';
import subscriptions from '../../../subscriptions';
import TraceBoxes from './TraceBoxes';
import TraceTimeline from './TraceTimeline';
import TracePicker from './TracePicker';
import MultiTraceApp from '../multiTrace/MultiTraceApp';

import { DEFAULT_TRACE_BOXES, DEFAULT_TRACE_GRAPHS, SUBSCRIPTIONS } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import './TraceTabApp.css'

const [ latestSubscription ] = SUBSCRIPTIONS;

class TraceTabApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      traceBoxAdderOpen: false,
      tracePickerOpenFor: null
    };
  }
  render() {
    return <div className="c-trace-tab">
      <div className="c-trace-tab__boxes">
        <TraceBoxes
          latestTraceRecord={this.getLatestTraceRecord()}
          traces={this.getTraceBoxes()}
          onTraceAddRequested={() => this.openTraceBoxAdder()}
          onTraceRemoveRequested={idx => this.removeTraceBox(idx)} />
      </div>
      <div className="c-trace-tab__timeline">
        <TraceTimeline data={this.props.data} />
      </div>
      {this.renderColumn(0)}
      {this.renderColumn(1)}
      {this.renderColumn(2)}
      {this.renderColumn(3)}
      <Modal
          isOpen={this.state.traceBoxAdderOpen}
          onRequestClose={() => this.closeTraceBoxAdder()}
          className='c-trace-picker'
          overlayClassName='c-trace-picker__overlay'
          contentLabel="Add Trace">
        <TracePicker
          trace={SUPPORTED_TRACES[0].trace}
          onTraceChange={trace => this.addTraceBox(trace)} />
      </Modal>
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
                          widthCols={3}
                          isTraceChangeSupported={true}
                          onTraceChangeRequested={trace => this.openTracePicker(colNumber, trace)}>
      </MultiTraceApp>
    </div>;
  }

  openTraceBoxAdder() {
    this.setState({traceBoxAdderOpen: true});
  }

  closeTraceBoxAdder() {
    this.setState({traceBoxAdderOpen: false});
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

  getTraceBoxes() {
    return this.props.traceBoxes || DEFAULT_TRACE_BOXES;
  }

  getTraceGraphs() {
    return this.props.traceGraphs || DEFAULT_TRACE_GRAPHS;
  }

  addTraceBox(trace) {
    const newTraceBoxes = this.getTraceBoxes().push(trace);
    this.props.onSettingChange('traceBoxes', newTraceBoxes);
    this.closeTraceBoxAdder();
  }

  removeTraceBox(index) {
    const newTraceBoxes = this.getTraceBoxes().delete(index);
    this.props.onSettingChange('traceBoxes', newTraceBoxes);
  }

  setTraceGraph(number, trace) {
    const newTraceGraphs = this.getTraceGraphs().set(number, trace);
    this.props.onSettingChange('traceGraphs', newTraceGraphs);
    this.closeTracePicker();
  }

  getLatestTraceRecord() {
    return subscriptions.selectors.getSubData(this.props.data, latestSubscription);
  }

}

TraceTabApp.propTypes = {
  data: ImmutablePropTypes.map,
  traceBoxes: ImmutablePropTypes.list,
  traceGraphs: ImmutablePropTypes.list,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired
};

export default TraceTabApp;
