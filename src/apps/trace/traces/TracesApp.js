import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { List, fromJS } from 'immutable';

import LoadingIndicator from '../../../common/LoadingIndicator';
import TracesSlider from './TracesSlider';
import TracesSettingsBar from "./TracesSettingsBar";
import TracesDepthBar from "./TracesDepthBar";
import TracesChartContainer from './TracesChartContainer';
import TracesBoxColumn from "./TracesBoxColumn";
import subscriptions from '../../../subscriptions';
import { SUBSCRIPTIONS, DEFAULT_TRACE_GRAPHS } from './constants';
import { SUPPORTED_TRACES } from '../constants';
import * as api from '../../../api';

import './TracesApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

class TracesApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      end: 1,
      filteredData: new List(),
    };
    this.render = this.render.bind(this);
    this.summaryData = new List();
    this.includeDetailedData = false;
    this.timerID = null;
  }

  render() {

    let latestData = this.props.data ? subscriptions.selectors.getSubData(this.props.data, latestSubscription): null;
    let supportedTraces = this.mergeSupportedTraces(latestData);

    return <div className="c-traces" onWheel={e => this.tracesSlider.scrollRange(e)}>
      <TracesSlider
        summaryData={this.summaryData}
        filteredData={this.state.filteredData}
        widthCols={this.props.widthCols}
        ref={c => { this.tracesSlider = c; }}
        onRangeChanged={(start, end, triggered) => this.updateFilteredData(start, end, triggered)} />
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
        traceRowCount={this.props.traceRowCount}
        includeDetailedData={this.includeDetailedData}/>
      <TracesBoxColumn
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        traceBoxes={this.props.traceBoxes || new List()}
        data={latestData}
        onSettingChange={this.props.onSettingChange} />
      {this.renderEmpty()}
    </div>;
  }

  renderEmpty() {
    if (!this.summaryData.size > 0) {
      return <div className="c-traces__loading"><LoadingIndicator/></div>;
    }
  }

  mergeSupportedTraces(latestData) {
    if (!latestData) {
      return SUPPORTED_TRACES;
    }

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
    if(!this.props.data && nextProps.data) {
      let latestData = subscriptions.selectors.getSubData(nextProps.data, latestSubscription);
      console.log(JSON.stringify(latestData));
      if(latestData) {
        let end = latestData.get('timestamp');
        let start = end - (60 * 60 * 4);
        this.updateFilteredData(end - (60 * 60 * 4), end, false);
      }
    }

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

  async updateFilteredData(start=null, end=null, triggeredByUser=false) {
    //if(!this.summaryData.size > 0) {
    //  return;
    //}

    if (triggeredByUser) {
      // We want to clear the detailed data timer if the user is actively scrolling.
      this.includeDetailedData = false;
      clearInterval(this.timerID);

      // After 5 seconds of no scrolling, we load detailed data
      this.timerID = setInterval(() => {
        this.includeDetailedData = true;
        this.updateFilteredData();
      }, 2000);
    }

    start = start !== null ? start : this.state.start;
    end = end !== null ? end : this.state.end;

    let firstTimestamp = 0, lastTimestamp = 0, startTS = 0, endTS = 0;

    if(this.summaryData && this.summaryData.size > 0) {
      firstTimestamp = this.summaryData.first().get("timestamp");
      lastTimestamp = this.summaryData.last().get("timestamp");
      startTS = firstTimestamp + start * (lastTimestamp - firstTimestamp);
      endTS = firstTimestamp + end * (lastTimestamp - firstTimestamp);
    }
    else {
      startTS = firstTimestamp = start;
      endTS = lastTimestamp = end;
    }

    // We will load either rough or find data depending on how long the user hasn't changed the slider
    let filteredData;
    if (this.includeDetailedData && (endTS - startTS) < 43200 ) { // If the slider is enclosing less than 12 hours, we load fine data.
      filteredData = await this.loadFineFilteredData(startTS, endTS);
    } else {
      filteredData = this.getRoughFilteredData(startTS, endTS);
    }

    // Flattening the data out
    filteredData = filteredData.map(value => value.flatten());

    this.setState({
      start,
      end,
      filteredData
    });
  }

  getRoughFilteredData(startTS, endTS) {
    return this.summaryData.filter(point => {
      let ts = point.get('timestamp');
      return ts >= Math.round(startTS) && ts <= Math.round(endTS);
    });

    /*let params = fromJS({
      asset_id: this.asset.get('id'),
      sort: '{timestamp:1}',
      fields: 'timestamp,data.recommended_minimum_flowrate',
      limit: (endTS - startTS) / 1800, // This is a year's worth of minutes. We're required to include a limit.
      where: `{(this.timestamp - (this.timestamp % 60)) == (this.timestamp - (this.timestamp % 1800))`
    });
    let predicted = await api.getAppStorage('corva', 'hydraulics.overview', 51, params);*/
  }

  async loadFineFilteredData(startTS, endTS) {
    let params = fromJS({
      'asset_id': 3,
      'query': `{timestamp#gte#${Math.round(startTS)}}}and{timestamp#lte#${Math.round(endTS)}}`,
      'limit': 525600, // This is a year's worth of minutes. We're required to include a limit.
    });
    let result = await api.getAppStorage('corva', 'wits.summary-1m', this.props.asset.get('id'), params);
    return result.reverse();
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
  asset: ImmutablePropTypes.map,
};

export default TracesApp;
