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
      assetList: new List(),
    };

    this.render = this.render.bind(this);
    this.summaryData = new List();
    this.sliderData = new List();
    this.includeDetailedData = false;
    this.timerID = null;

    this.fineData = {
      start: null,
      end: null,
      data: null,
    };
  }

  async componentDidMount() {
    api.getAssets().then((assetList) => {
      this.setState({
        assetList,
      });
    });

    this.preloadInitialSliderData();
  }

  preloadInitialSliderData() {
    let params = fromJS({
      asset_id: this.props.params.assetId,
      sort: '{timestamp:1}',
      limit: 5000,
      fields: 'timestamp,data.hole_depth,data.bit_depth',
    });

    api.getAppStorage('corva', 'wits.summary-30m', this.props.params.assetId, params).then((result) => {
      if (this.summaryData.size === 0) {
        this.sliderData = result;
        this.forceUpdate();
      }
    });
  }

  render() {
    let latestData = this.props.data ? subscriptions.selectors.getSubData(this.props.data, latestSubscription): null;
    let supportedTraces = this.mergeSupportedTraces(latestData);

    return <div className="c-traces" onWheel={e => this.tracesSlider.scrollRange(e)}>
      <TracesSlider
        summaryData={this.summaryData.size > 0 ? this.summaryData : this.sliderData}
        filteredData={this.state.filteredData}
        widthCols={this.props.widthCols}
        ref={c => { this.tracesSlider = c; }}
        onRangeChanged={(start, end, triggered) => this.updateFilteredData(start, end, triggered)} />
      <TracesSettingsBar
        traceColumnCount={this.props.traceColumnCount}
        traceRowCount={this.props.traceRowCount}
        onSettingChange={this.props.onSettingChange}
        onZoomIn={() => this.tracesSlider.zoomIn()}
        onZoomOut={() => this.tracesSlider.zoomOut()} />
      <TracesDepthBar
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        data={this.state.filteredData}
        latestData={latestData} />
      <TracesChartContainer
        data={this.state.filteredData}
        asset={this.props.asset}
        latestData={latestData}
        widthCols={this.props.widthCols}
        assetList={this.state.assetList}
        onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
        onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
        onSettingChange={this.props.onSettingChange}
        traceGraphs={DEFAULT_TRACE_GRAPHS.merge(this.props.traceGraphs)}
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        traceColumnCount={this.props.traceColumnCount}
        traceRowCount={this.props.traceRowCount}
        includeDetailedData={this.includeDetailedData}/>
      <TracesBoxColumn
        assetList={this.state.assetList}
        convert={this.props.convert}
        supportedTraces={supportedTraces}
        traceBoxes={this.props.traceBoxes || new List()}
        data={latestData}
        onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
        onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
        onSettingChange={this.props.onSettingChange} />
      {this.renderEmpty()}
    </div>;
  }

  renderEmpty() {
    if (this.summaryData.size === 0 && this.sliderData.size === 0) {
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
    let summaryData = subscriptions.selectors.getSubData(nextProps.data, summarySubscription, false);
    if (!summaryData) {
      return;
    }

    this.summaryData = this.convertUnits(summaryData);
    this.sliderData = null;
}

  componentWillUnmount() {
    clearInterval(this.timerID);
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
      if (!trace || !trace.hasOwnProperty('unitType') || !trace.hasOwnProperty('cunit')) {
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
    if (triggeredByUser) {
      // We want to clear the detailed data timer if the user is actively scrolling.
      this.includeDetailedData = false;
      clearInterval(this.timerID);

      // After 5 seconds of no scrolling, we load detailed data
      this.timerID = setInterval(() => {
        this.includeDetailedData = true;
        if(this.summaryData && this.summaryData.size > 0) {
          this.updateFilteredData();
        }
      }, 2000);
    }

    start = start !== null ? start : this.state.start;
    end = end !== null ? end : this.state.end;

    let startTS = start;
    let endTS = end;

    if(this.summaryData && this.summaryData.size > 0) {
      let firstTimestamp = this.summaryData.first().get("timestamp");
      let lastTimestamp = this.summaryData.last().get("timestamp");
      startTS = firstTimestamp + start * (lastTimestamp - firstTimestamp);
      endTS = firstTimestamp + end * (lastTimestamp - firstTimestamp);
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
    startTS = Math.round(startTS);
    endTS = Math.round(endTS);

    let filteredData = this.summaryData.filter(point => {
      let ts = point.get('timestamp');
      return ts >= startTS && ts <= endTS;
    });

    // If we have less than 2 items, we force at least 3 into the list.
    if (filteredData.size < 2) {
      filteredData = new List();
      let done = false;

      this.summaryData.valueSeq().forEach((value) => {
        if (done) {
          return;
        }

        if (filteredData.size <= 1 && value.get('timestamp') <= startTS) {
          filteredData = filteredData.set(0, value);
        } else if (filteredData.size === 1 && value.get('timestamp') > startTS && value.get('timestamp') < endTS) {
          filteredData = filteredData.push(value);
        } else if (filteredData.size <= 2 && value.get('timestamp') >= endTS) {
          filteredData = filteredData.push(value);
          done = true;
        }
      });

      if (filteredData.size === 1) {
        filteredData = filteredData.push(filteredData.first());
      }
    }

    return filteredData;
  }

  async loadFineFilteredData(startTS, endTS) {
    // If we're loading for the same range as a previous load, we just return the data from the previous load.
    if (this.fineData.data !== null) {
      if (this.fineData.start === startTS && this.fineData.end === endTS) {
        return this.fineData.data;
      }
    }

    this.fineData.start = startTS;
    this.fineData.end = endTS;

    let params = fromJS({
      'asset_id': this.props.params.assetId,
      'where': `{this.timestamp >= ${Math.round(startTS)} && this.timestamp <= ${Math.round(endTS)}}`,
      'limit': 525600, // This is a year's worth of minutes. We're required to include a limit.
    });

    if(!this.props.asset) {
      return [];
    }

    let result = await api.getAppStorage('corva', 'wits.summary-1m', this.props.params.assetId, params);
    this.fineData.data = result.reverse();

    if (this.fineData.data.size === 0) {
      this.fineData.data = this.getRoughFilteredData(startTS, endTS);
    }

    return this.fineData.data;
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
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSubscribe: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  asset: ImmutablePropTypes.map,
};

export default TracesApp;
