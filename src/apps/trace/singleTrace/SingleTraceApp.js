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

import './SingleTraceApp.css'

class SingleTraceApp extends Component {

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
      <div className="c-trace-single">
        <h3>{this.getTrace().label}</h3>
        {this.getLatestTrace() ?
          this.renderLatestTrace() :
          <LoadingIndicator />}
        {this.state.summary.size > 0 ?
          this.renderTraceSummaryGraph() :
          <LoadingIndicator />}
      </div>
    );
  }

  renderLatestTrace() {
    return (
      <div className="c-trace-single__latest">
        <span className="c-trace-single__latest__value">
          {this.getLatestTrace()}
        </span>
        <span className="c-trace-single__latest__unit">
          {this.getTrace().unit}
        </span>
      </div>
    );
  }

  renderTraceSummaryGraph() {
    return <div className="c-trace-single__graph">
      <Chart
        horizontal
        xAxisOpposite
        yAxisOpposite
        xField="time"
        size={this.props.size}
        widthCols={this.props.widthCols}
        xAxisLabelFormatter={(...a) => this.formatDate(...a)}>
        <ChartSeries
          dashStyle='Solid'
          lineWidth={1}
          key={this.props.trace}
          id={this.props.trace}
          title={this.getTrace().label}
          data={this.state.summary}
          yField={this.props.trace}
          color={this.getSeriesColor()} />
          </Chart>
    </div>;
  }

  formatDate(d, isFirst, isLast) {
    return isFirst || isLast ?
      distanceInWordsToNow(new Date(d)) + ' ago' :
      '';
  }

  getTrace() {
    return find(SUPPORTED_TRACES, {trace: this.props.trace}) || {};
  }

  getLatestTrace() {
    return this.props.data && this.props.data.hasIn(['corva.source.witsml', 'summary_30_seconds']) ?
      numeral(this.props.data.getIn(['corva.source.witsml', 'raw', this.props.trace])).format('0.0a') :
      null;
  }

  getTraceSummary(props) {
    return props.data && props.data.getIn(['corva.source.witsml', 'summary_30_seconds']);
  }

  getSeriesColor() {
    if (this.props.graphColors && this.props.graphColors.has('trace')) {
      return this.props.graphColors.get('trace');
    } else {
      return SUPPORTED_CHART_SERIES['trace'].defaultColor;
    }
  }

}

SingleTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  trace: PropTypes.string.isRequired,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default SingleTraceApp;
