import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import { isEqual } from 'lodash'

/*
  This graph expects that series' will be provided as an array of objects containing x/y and a label and/or color
  Also accepted are arrays of [X,Y] for each element in the series.

  Why do we need this in addition to the Chart component?
    The Chart component expects a provided, static Y-Axis that all X points will be plotted on.
    If we want to have each series not dependent on a static Y axis, and/or if our Y values will
    vary from series to series, the ObjectGraph is the appropriate choice.

  Highcharts documentation for a graph with irregular intervals: http://www.highcharts.com/demo/spline-irregular-time
 */

class ObjectGraph extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const graph = Highcharts.chart(this.container, {
      chart: {
        type: 'line',
        backgroundColor: 'rgb(37, 41, 41)',
        plotBackgroundColor: 'rgb(42, 46, 46)',
        inverted: this.props.inverted || false,
        marginTop: 0,
        marginRight: 0,
      },
      xAxis: {
        title: {
          text: ''
        },
        labels: {
          formatter: this.props.xAxisLabelFormatter || null,
          format: this.props.xAxisLabelFormat || "{value}",
          useHTML: true,
        },
        gridLineWidth: 0,
        tickWidth: 0,
        lineWidth: 0,
        showFirstLabel: false,
        showLastLabel: false,
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          formatter: this.props.yAxisLabelFormatter || null,
          format: this.props.yAxisLabelFormat || "{value}",
          useHTML: true,
        },
        gridLineWidth: 0,
        lineWidth: 0,
        showFirstLabel: false,
        showLastLabel: false,
      },
      legend: {
        enabled: false
      },
      title: {text: null},
      credits: {enabled: false},
      series: this.props.series
    });
    this.setState({graph});
  }

  componentWillReceiveProps(newProps) {
    if (typeof this.state.graph === 'undefined') {
      return;
    }
    const graph = this.state.graph;
    let redraw = false;
    for (let i = 0; i < graph.series.length; i++) {
      if (!isEqual(newProps.series[i].data, this.props.series[i].data)) {
        graph.series[i].update(newProps.series[i], false);
        redraw = true;
      }
    }
    if (redraw) {
      graph.redraw(false);
    }
  }
}

ObjectGraph.propTypes = {
  series: PropTypes.array.isRequired,
  xAxisLabelFormat: PropTypes.string,
  yAxisLabelFormat: PropTypes.string,
  xAxisLabelFormatter: PropTypes.func,
  yAxisLabelFormatter: PropTypes.func,
  inverted: PropTypes.bool,
};

export default ObjectGraph;