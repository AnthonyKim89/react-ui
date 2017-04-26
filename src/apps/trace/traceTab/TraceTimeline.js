import React, { Component } from 'react';
import { List } from 'immutable';
import { format as formatTime } from 'date-fns';
import Highcharts from 'highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './TraceTimeline.css';

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
        plotBackgroundColor: 'rgb(42, 46, 46)',
        spacing: [0, 0, 0, 0],
        style: {overflow: 'visible'}
      },
      plotOptions: {
        series: {
          turboThreshold: 5000,
          stacking: 'normal'
        },
        column: {
          groupPadding: 0,
          borderWidth: 0
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
      yAxis: [{
        id: 'depthAxis',
        type: 'linear',
        reversed: true,
        gridLineWidth: 0,
        title: {enabled: false},
        labels: {
          style: {
            color: '#fff'
          },
          formatter: function() {
            return parseFloat(this.value).toFixed();
          }
        }
      }, {
        id: 'timeAxis',
        type: 'datetime',
        reversed: true,
        title: {enabled: false},
        labels: {
          style: {
            color: '#fff',
          },
          formatter: function() {
            return formatTime(this.value, 'H:mm');
          }
        }
      }],
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
           !this.getTraceSummary(newProps).equals(this.getTraceSummary(this.props));
  }

  addSummaryData(summary) {
    // The new data could by either a list of maps or a single map.
    const newData = List.isList(summary) ?
      summary.map(s => s.update('timestamp', t => new Date(t * 1000))) :
      List.of(summary.update('timestamp', t => new Date(t * 1000)));
    return this.state.summary
      .concat(newData)
      .sortBy(s => s.get('timestamp').getTime());
  }

  render() {
    return <div className="c-trace-timeline">
      <div className="c-trace-timeline__chart"
           ref={container => this.container = container} />
    </div>;
  }

  updateChart(summary) {
    const chart = this.state.chart;
    
    const firstSummary = summary.first();
    const lastSummary = summary.last();
    
    const timeAxis = chart.get('timeAxis');
    const minTime = firstSummary.get('timestamp').getTime();
    const maxTime = lastSummary.get('timestamp').getTime();
    timeAxis.update({min: minTime, max: maxTime});
    const depthAxis = chart.get('depthAxis');
    const minDepth = firstSummary.getIn(['data', 'hole_depth']);
    const maxDepth = lastSummary.getIn(['data', 'hole_depth']);
    depthAxis.update({min: minDepth, max: maxDepth});

    // If there was a series previously, remove it.
    const prevSeries = chart.get('series');
    if (prevSeries) {
      prevSeries.remove();
    }

    // Add the new series. Once there is actual summary data to play with,
    // this should construct the stack of blocks from it.
    chart.addSeries({
      id: 'series',
      data: [maxTime],
      color: 'rgb(5, 71, 170)',
      animation: false
    });
  }

  getTraceSummary(props) {
    return props.data && props.data.getIn(['corva', 'wits.summary-1m', '']);
  }  
  
}

TraceTimeline.propTypes = {
  data: ImmutablePropTypes.map
};

export default TraceTimeline;
