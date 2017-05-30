import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { List } from 'immutable';

import LoadingIndicator from '../../../common/LoadingIndicator';
import TracesSlider from './TracesSlider';
import TracesSettingsBar from "./TracesSettingsBar";
import TracesDepthBar from "./TracesDepthBar";
import TracesChartContainer from './TracesChartContainer';
import TracesBoxColumn from "./TracesBoxColumn";
import subscriptions from '../../../subscriptions';
import { SUBSCRIPTIONS, DEFAULT_TRACE_GRAPHS } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import './TracesApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

class TracesApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      end: 1,
      filteredData: new List()
    };
    this.render = this.render.bind(this);
    this.summaryData = new List();
  }

  render() {
    if (!this.summaryData.size > 0) {
      return <LoadingIndicator/>;
    }

    let latestData = subscriptions.selectors.getSubData(this.props.data, latestSubscription);
    let supportedTraces = this.mergeSupportedTraces(latestData);

    return <div className="c-traces" onWheel={e => this.tracesSlider.scrollRange(e)}>
      <TracesSlider
        summaryData={this.summaryData}
        filteredData={this.state.filteredData}
        widthCols={this.props.widthCols}
        ref={c => { this.tracesSlider = c; }}
        onRangeChanged={(start, end) => this.updateFilteredData(start, end)} />
      <TracesSettingsBar
        traceColumnCount={this.props.traceColumnCount}
        traceRowCount={this.props.traceRowCount}
        onSettingChange={this.props.onSettingChange} />
      <TracesDepthBar
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        data={this.state.filteredData}
        latestData={latestData} />
      <TracesChartContainer
        data={this.state.filteredData}
        latestData={latestData}
        widthCols={this.props.widthCols}
        onSettingChange={this.props.onSettingChange}
        traceGraphs={DEFAULT_TRACE_GRAPHS.merge(this.props.traceGraphs)}
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        traceColumnCount={this.props.traceColumnCount}
        traceRowCount={this.props.traceRowCount} />
      <TracesBoxColumn
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        traceBoxes={this.props.traceBoxes || new List()}
        data={latestData}
        onSettingChange={this.props.onSettingChange} />
    </div>;
  }

  mergeSupportedTraces(latestData) {
    let witsSupportedTraces = latestData.get('data').toJS();

    for (let property in witsSupportedTraces) {
      if (!witsSupportedTraces.hasOwnProperty(property)) {
        continue;
      }
      if (!find(SUPPORTED_TRACES, {trace: property})) {
        SUPPORTED_TRACES.push({
          trace: property,
          label: property.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        });
      }
    }

    return SUPPORTED_TRACES;
  }

  componentWillUpdate(nextProps) {
    let summaryData = subscriptions.selectors.getSubData(nextProps.data, summarySubscription, false);
    if (!summaryData) {
      return;
    }

    this.summaryData = this.convertUnits(summaryData);
  }

  convertUnits(filteredData) {
    let traceGraphs = this.props.traceGraphs || DEFAULT_TRACE_GRAPHS;

    traceGraphs.valueSeq().forEach(traceGraph => {
      filteredData = this.convertUnitField(traceGraph, filteredData);
    });

    let traceBoxes = this.props.traceBoxes || new List();

    traceBoxes.valueSeq().forEach(traceBox => {
      if (!traceGraphs.find(value => value.get('trace') === traceBox.get('trace')) ) {
        filteredData = this.convertUnitField(traceBox, filteredData);
      }
    });

    return filteredData;
  }

  convertUnitField(traceEntry, filteredData) {
    let traceKey = traceEntry.get('trace');
    if (!traceKey) {
      return filteredData;
    }

    let unitType = traceEntry.get('unitType');
    let unitFrom = traceEntry.get('unitFrom');
    let unitTo = traceEntry.get('unitTo', null);

    // Typically we will fall into this if-statement because common selections won't have a unit type chosen.
    if (!unitType) {
      let trace = find(SUPPORTED_TRACES, {trace: traceKey});
      if (!trace || !traceKey.hasOwnProperty('unitType') || !traceKey.hasOwnProperty('cunit')) {
        return filteredData;
      }
      unitType = trace.unitType;
      unitFrom = trace.cunit;
    }

    if (!unitFrom) {
      unitFrom = this.props.convert.getUnitPreference(unitType);
    }

    return this.props.convert.convertImmutables(filteredData, traceKey, unitType, unitFrom, unitTo);
  }

  updateFilteredData(start=null, end=null) {
    start = start !== null ? start : this.state.start;
    end = end !== null ? end : this.state.end;

    let firstTimestamp = this.summaryData.first().get("timestamp");
    let lastTimestamp = this.summaryData.last().get("timestamp");

    let startTS = firstTimestamp + start * (lastTimestamp - firstTimestamp);
    let endTS = firstTimestamp + end * (lastTimestamp - firstTimestamp);

    let filteredData = this.summaryData.filter(point => {
      let ts = point.get('timestamp');
      return ts >= Math.round(startTS) && ts <= Math.round(endTS);
    });

    // Flattening the data out
    filteredData = filteredData.map(value => value.flatten());

    this.setState({
      start,
      end,
      filteredData
    });
  }
}

TracesApp.propTypes = {
  traceGraphs: ImmutablePropTypes.list,
  traceBoxes: ImmutablePropTypes.list,
  traceColumnCount: PropTypes.number,
  traceRowCount: PropTypes.number,
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesApp;
