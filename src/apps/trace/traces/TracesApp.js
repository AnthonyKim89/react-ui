import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { List } from 'immutable';

import LoadingIndicator from '../../../common/LoadingIndicator';
import TracesSlider from './TracesSlider';
import TracesChartContainer from './TracesChartContainer';
import subscriptions from '../../../subscriptions';
import { SUBSCRIPTIONS, DEFAULT_TRACE_GRAPHS } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import './TracesApp.css';

const [ _, summarySubscription ] = SUBSCRIPTIONS;

class TracesApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      end: 1,
      filteredData: new List()
    };
    this.render = this.render.bind(this);
  }

  render() {
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);
    if (!summaryData) {
      return <LoadingIndicator/>;
    }

    return <div className="c-traces" onWheel={e => this.tracesSlider.scrollRange(e)}>
      <TracesSlider
        summaryData={summaryData}
        filteredData={this.state.filteredData}
        widthCols={this.props.widthCols}
        ref={c => { this.tracesSlider = c; }}
        onRangeChanged={(start, end) => this.updateFilteredData(start, end)} />
      <TracesChartContainer
        data={this.state.filteredData}
        widthCols={this.props.widthCols}
        onSettingChange={this.props.onSettingChange}
        traceGraphs={this.props.traceGraphs || DEFAULT_TRACE_GRAPHS}
        convert={this.props.convert}
        supportedTraces={SUPPORTED_TRACES} />
    </div>;
  }

  updateFilteredData(start=null, end=null) {
    start = start !== null ? start : this.state.start;
    end = end !== null ? end : this.state.end;
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);

    let firstTimestamp = summaryData.first().get("timestamp");
    let lastTimestamp = summaryData.last().get("timestamp");

    let startTS = firstTimestamp + start * (lastTimestamp - firstTimestamp);
    let endTS = firstTimestamp + end * (lastTimestamp - firstTimestamp);

    let filteredData = summaryData.filter(point => {
      let ts = point.get('timestamp');
      return ts >= Math.round(startTS) && ts <= Math.round(endTS);
    });

    // Flattening the data out
    filteredData = filteredData.map(value => value.flatten());

    // Converting the units based on what the user has for prefs and settings
    filteredData = this.convertUnits(filteredData);

    this.setState({
      start,
      end,
      filteredData
    });
  }

  convertUnits(filteredData) {
    let traceGraphs = this.props.traceGraphs || DEFAULT_TRACE_GRAPHS;

    traceGraphs.valueSeq().forEach(traceGraph => {
      let traceKey = traceGraph.get('trace');
      if (!traceKey) {
        return;
      }

      let unitType = traceGraph.get('unitType');
      let unitFrom = traceGraph.get('unitFrom');
      let unitTo = traceGraph.get('unitTo', null);

      // Typically we will fall into this if-statement because common selections won't have a unit type chosen.
      if (!unitType) {
        let trace = find(SUPPORTED_TRACES, {trace: traceKey});
        if (!trace || !traceKey.hasOwnProperty('unitType') || !traceKey.hasOwnProperty('cunit')) {
          return;
        }
        unitType = trace.unitType;
        unitFrom = trace.cunit;
      }

      filteredData = this.props.convert.convertImmutables(filteredData, traceKey, unitType, unitFrom, unitTo);
    });

    return filteredData;
  }
}

TracesApp.propTypes = {
  traceGraphs: ImmutablePropTypes.list,
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesApp;
