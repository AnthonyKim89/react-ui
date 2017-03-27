import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { List } from 'immutable';
import numeral from 'numeral';
import { distanceInWordsToNow } from 'date-fns';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import { SUPPORTED_TRACES } from '../constants';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './SingleTraceApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

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
           !this.getTraceSummary(newProps).equals(this.getTraceSummary(this.props));
  }

  addSummaryData(summary) {
    // The new data could by either a list of maps or a single map.
    const newData = List.isList(summary) ?
      summary.map(s => s.update('timestamp', t => new Date(t * 1000))) :
      List.of(summary.update('timestamp', t => new Date(t * 1000)));
    return this.state.summary
      .concat(newData.map(itm => itm.merge(itm.get('data')).delete('data')))
      .sortBy(s => s.get('timestamp').getTime());
  }

  render() {
    return (
      <div className="c-trace-single">
        <h4>{this.getTrace().label}</h4>
        {this.hasLatestTrace() ?
          this.renderLatestTrace() :
          <LoadingIndicator />}
        {this.state.summary.size > 0 ?
          this.renderTraceSummaryGraph() :
          <LoadingIndicator />}
      </div>
    );
  }

  renderLatestTrace() {
    // Formatting the units to display properly.
    let traceSpec = this.getTrace();
    let unitDisplay = traceSpec.unit;
    if (traceSpec.hasOwnProperty("unitType") && unitDisplay.includes("{u}")) {
      let formatUnit = this.props.convert.GetUnitPreference(traceSpec.unitType);
      if (formatUnit !== traceSpec.unit) {
        if (traceSpec.hasOwnProperty('cunitFormat') && traceSpec.cunitFormat.hasOwnProperty(formatUnit)) {
          formatUnit = traceSpec.cunitFormat[formatUnit];
        }
        traceSpec.unit = unitDisplay.replace('{u}', formatUnit);
      }
    }

    return (
      <div className="c-trace-single__latest">
        <span className="c-trace-single__latest__value">
          {this.getLatestTrace(traceSpec)}
        </span>
        <span className="c-trace-single__latest__unit">
          {traceSpec.unit}
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
        xField="timestamp"
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

  hasLatestTrace() {
    return !!subscriptions.selectors.getSubData(this.props.data, latestSubscription);
  }

  getLatestTrace(spec) {
    let trace = subscriptions.selectors.getSubData(this.props.data, latestSubscription);
    if (trace) {
      trace = trace.getIn(['data', this.props.trace]);
      if (spec.hasOwnProperty("unitType")) {
        trace = this.props.convert.ConvertValue(trace, spec.unitType, spec.cunit);
      }
      return numeral(trace).format('0.0a');
    }
    return null;
  }

  getTraceSummary(props) {
    return subscriptions.selectors.getSubData(props.data, summarySubscription);
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
