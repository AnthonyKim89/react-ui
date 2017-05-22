import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import { isEqual } from 'lodash';
import { Size } from './constants';


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
        type: this.props.chartType || 'line',
        inverted: !this.props.horizontal,
        backgroundColor: null,
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        plotBackgroundColor: 'rgb(42, 46, 46)',
        spacing: this.props.noSpacing ? [0, 0, 0, 0] : [10, 10, 15, 10],
        marginBottom: this.props.marginBottom || null
      },
      plotOptions: {
        series: {
          turboThreshold: 5000
        },
      },
      xAxis: {
        title: this.isAxisLabelsVisible(this.props) ? this.props.xAxisTitle : {text:null},
        gridLineWidth: this.props.gridLineWidth || 1,
        gridLineColor: 'rgb(47, 51, 51)',
        lineWidth: this.props.xAxisWidth || 0,
        lineColor:  this.props.xAxisColor || '',
        tickWidth: 0,
        labels: {
          enabled: this.isAxisLabelsVisible(this.props) && !this.props.hideXAxis,
          autoRotation: false,
          style: this.props.xLabelStyle || {color: '#fff'},
        },

        opposite: this.props.xAxisOpposite,
        tickPositioner: this.props.xTickPositioner,
        plotLines: this.props.xPlotLines,
      },
      yAxis: {
        title: this.props.yAxisTitle || {text: null},
        gridLineWidth: this.props.gridLineWidth || 1,
        gridLineColor: 'rgb(47, 51, 51)',
        labels: {
          enabled: this.isAxisLabelsVisible(this.props) && !this.props.hideYAxis,
          style:  this.props.yLabelStyle || {color: '#fff'},
        },
        opposite: this.props.yAxisOpposite,
        min: null,
        max: null,
        lineWidth: this.props.yAxisWidth || 0,
        lineColor:  this.props.yAxisColor || '',
        tickPositioner: this.props.yTickPositioner,
        plotLines: this.props.yPlotLines,
        reversed: this.props.yAxisReversed || false
      },
      legend: this.props.legend || {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {color: '#fff'},
        enabled: true,
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
    let redraw = false, reflow = false;

    for (let i = 0; i < graph.series.length; i++) {
      if (!isEqual(newProps.series[i].data, this.props.series[i].data)) {
        graph.series[i].update(newProps.series[i], false);
        redraw = true;
      }
    }

    if (newProps.coordinates !== this.props.coordinates) {
      const legendVisible = this.isLegendVisible(newProps);
      for (let i = 0 ; i < graph.series.length ; i++) {
        graph.series[i].update({showInLegend: legendVisible}, false);
      }
      graph.xAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps) && !newProps.hideXAxis}
      }, false);
      graph.yAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps) && !newProps.hideYAxis}
      }, false);
      reflow = true;
      redraw = true;
    } else if (newProps.widthCols !== this.props.widthCols) {
      reflow = true;
    }

    if (reflow) { graph.reflow(); }
    if (redraw) {
      graph.redraw(false);
    }
  }


  isLegendVisible(props) {
    return props.showLegend && (props.size === Size.XLARGE);
  }

  isAxisLabelsVisible(props) {    
    return props.size !== Size.SMALL;
  }
}

ObjectGraph.propTypes = {
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object,
  series: PropTypes.array.isRequired,
  xAxisLabelFormat: PropTypes.string,
  yAxisLabelFormat: PropTypes.string,
  xAxisLabelFormatter: PropTypes.func,
  yAxisLabelFormatter: PropTypes.func,
  inverted: PropTypes.bool,
};

export default ObjectGraph;
