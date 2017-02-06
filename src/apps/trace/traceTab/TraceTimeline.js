import React, { Component } from 'react';
import { List } from 'immutable';
import { parse as parseTime } from 'date-fns';
import Highcharts from 'highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './TraceTimeline.css'

class TraceTimeline extends Component {

  constructor(props) {
    super(props);
    this.state = {summary: List()};
  }

  componentDidMount() {
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: 'column',
        backgroundColor: null,
        plotBackgroundColor: 'rgb(42, 46, 46)'
      },
      plotOptions: {
        series: {
          turboThreshold: 5000,
          stacking: 'normal'
        }
      },
      xAxis: {
        categories: ['a', 'b', 'c', 'd', 'e'],
        gridLineColor: 'rgb(47, 51, 51)',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          enabled: false,
          autoRotation: false,
          style: {color: '#fff'}
        }
      },
      yAxis: {
        id: 'yAxis',
        type: 'datetime',
        reversed: true,
        endOnTick: false
      },
      title: {text: null},
      credits: {enabled: false},
      legend: {enabled: false},
      series: []
    });
    this.setState({chart});
  }

  componentWillReceiveProps(newProps) {
    if (this.isSummaryChanged(newProps)) {
      const summary = this.getTraceSummary(newProps);
      this.setState({summary: this.addSummaryData(summary)}, () => {
        this.updateChart(this.state.summary);
      });
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
    return <div className="c-trace-timeline">
      <div className="c-trace-timeline__chart"
           ref={container => this.container = container} />
    </div>;
  }

  updateChart(summary) {
    const chart = this.state.chart;
    const yAxis = chart.get('yAxis');
    const min = parseTime(summary.first().get('time')).getTime();
    const max = parseTime(summary.last().get('time')).getTime();
    yAxis.update({min, max});

    const prevSeries = chart.get('series');
    if (prevSeries) {
      prevSeries.remove();
    }
    const block = max - min;  
    chart.addSeries({
      id: 'series',
      data: [max],
      animation: false
    });
  }

  getTraceSummary(props) {
    return props.data && props.data.getIn(['corva.source.witsml','summary_30_seconds']);
  }  
  
}

TraceTimeline.propTypes = {
  data: ImmutablePropTypes.map
};

export default TraceTimeline;
