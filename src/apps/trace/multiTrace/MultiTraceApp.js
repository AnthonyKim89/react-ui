import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { List } from 'immutable';
import numeral from 'numeral';
import { parse as parseTime, distanceInWordsToNow } from 'date-fns';

import { SUPPORTED_CHART_SERIES } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './MultiTraceApp.css'

class MultiTraceApp extends Component {

  constructor(props) {
    super(props);
    this.state = {summary: List()};
  }

  componentWillReceiveProps(newProps) {
    if (this.isSummaryChanged(newProps)) {
      const summary = this.getTraceSummary(newProps);
      this.setState({summary: this.addSummaryData(summary)});
    }
  }

  isSummaryChanged(newProps) {
    return this.getTraceSummary(newProps) &&
           !this.getTraceSummary(newProps).equals(this.getTraceSummary(this.props))
  }

  addSummaryData(summary) {
    // The new data could by either a list of maps or a single map.
    const newData = List.isList(summary) ?
      summary.map(s => s.update('time', parseTime)) :
      List.of(summary.update('time', parseTime));
    return this.state.summary
      .concat(newData)
      .sortBy(s => s.get('time'));
  }

  render() {
    return (
      <div className="c-trace-multi">
        {this.getLatestTraceRecord() ?
          this.renderLatestTraces() :
          <LoadingIndicator />}
        {this.state.summary.size > 0 ?
          this.renderTraceSummaryGraph() :
          <LoadingIndicator />}
        {this.state.summary.size > 0 && this.renderTraceSummaryGraphRanges()}
      </div>
    );
  }

  renderLatestTraces() {
    return this.getActiveTraceKeys().map(trace => (
      <div className="c-trace-multi__latest" key={`latest-${trace}`}>
        <div className="c-trace-multi__latest__trace">
          <div className="c-trace-multi__latest__trace-name">
            {this.getTraceSpec(trace).label}
          </div>
          <div className="c-trace-multi__latest__trace-unit">
            {this.getTraceSpec(trace).unit}
          </div>
        </div>
        <div className="c-trace-multi__latest__value">
          {numeral(this.getLatestTraceValue(trace)).format('0.0a')}
        </div>
        <div className="c-trace-multi__latest__color-indicator">
          <div className="c-trace-multi__latest__color-indicator-inner"
               style={{borderRightColor: this.getSeriesColor(trace)}}></div>
          <div className="c-trace-multi__latest__color-indicator-outer"></div>
        </div>
      </div>
    ));
  }

  renderTraceSummaryGraph() {
    return <div className="c-trace-multi__graph">
      <Chart
        multiAxis
        xField="time"
        size={this.props.size}
        widthCols={this.props.widthCols}
        xAxisLabelFormatter={(...a) => this.formatDate(...a)}>
        {this.getActiveTraceKeys().map(trace => {
          const spec = this.getTraceSpec(trace);
          return <ChartSeries
            dashStyle='Solid'
            lineWidth={1}
            key={trace}
            id={trace}
            title={spec.label}
            minValue={spec.min}
            maxValue={spec.max}
            data={this.state.summary}
            yField={this.props[trace]}
            color={this.getSeriesColor(trace)} />;
        })}
      </Chart>
    </div>;
  }

  renderTraceSummaryGraphRanges() {
    return <div className="c-trace-multi__ranges">
      {this.getActiveTraceKeys().map(trace => (
        <div className="c-trace-multi__range"
             style={{borderBottomColor: this.getSeriesColor(trace)}}
             key={`range-${trace}`}>
          <span className="c-trace-multi__range-min">{this.getTraceSpec(trace).min}</span>
          <span className="c-trace-multi__range-max">{this.getTraceSpec(trace).max}</span>
          <div className="c-trace-multi__range-label">{this.getTraceSpec(trace).label}</div>
        </div>
      ))}
    </div>;
  }

  formatDate(d, isFirst, isLast) {
    return isFirst || isLast ?
      distanceInWordsToNow(new Date(d)) + ' ago' :
      '';
  }

  getTraceSpec(trace) {
    return find(SUPPORTED_TRACES, {trace: this.props[trace]}) || {};
  }

  getLatestTraceRecord() {
    return this.props.data && this.props.data.getIn(['corva.activity-detector', 'wits']);
  }

  getLatestTraceValue(trace) {
    const traceKey = this.props[trace];
    return this.getLatestTraceRecord().get(traceKey);
  }

  getTraceSummary(props) {
    return props.data && props.data.getIn(['corva.activity-detector','wits-summary-30s']);
  }

  getSeriesColor(trace) {
    if (this.props.graphColors && this.props.graphColors.has(trace)) {
      return this.props.graphColors.get(trace);
    } else {
      return SUPPORTED_CHART_SERIES[trace].defaultColor;
    }
  }

  getTraceKeys() {
    return ['trace1', 'trace2', 'trace3']
  }

  getActiveTraceKeys() {
    return this.getTraceKeys()
      .filter(k => this.props[k]);
  }

}

MultiTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  trace1: PropTypes.string,
  trace2: PropTypes.string,
  trace3: PropTypes.string,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default MultiTraceApp;
