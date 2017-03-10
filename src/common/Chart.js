import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import { differenceBy, intersectionBy, values } from 'lodash';
import { Size } from './constants';

class Chart extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const series = this.getSeries(this.props);
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: this.props.chartType || 'line',
        inverted: !this.props.horizontal,
        backgroundColor: null,
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        plotBackgroundColor: 'rgb(42, 46, 46)',
      },
      plotOptions: {
        series: {
          turboThreshold: 5000
        },
      },
      xAxis: {
        title: this.props.xAxisTitle,
        gridLineWidth: this.props.gridLineWidth || 1,
        gridLineColor: 'rgb(47, 51, 51)',
        lineWidth: this.props.xAxisWidth || 0,
        lineColor:  this.props.xAxisColor || '',
        tickWidth: 0,
        labels: {
          enabled: this.isAxisLabelsVisible(this.props) && !this.props.hideXAxis,
          autoRotation: false,
          style: this.props.xLabelStyle || {color: '#fff'},
          formatter: this.getXAxisLabelFormatter()
        },

        opposite: this.props.xAxisOpposite,
        tickPositioner: this.props.xTickPositioner,
        plotLines: this.props.xPlotLines,
      },
      yAxis: this.getYAxes(series, this.props),
      title: {text: null},
      credits: {enabled: false},
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {color: '#fff'},
        enabled: true,
      },
      series
    });
    this.setState({chart});
  }

  componentWillReceiveProps(newProps) {
    const chart = this.state.chart;
    let redraw = false, reflow = false;
    if (newProps.size !== this.props.size) {
      const legendVisible = this.isLegendVisible(newProps);
      for (let i = 0 ; i < chart.series.length ; i++) {
        chart.series[i].update({showInLegend: legendVisible}, false);
      }
      chart.xAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps) && !newProps.hideXAxis}
      }, false);
      chart.yAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps) && !newProps.hideYAxis}
      }, false);
      reflow = true;
      redraw = true;
    } else if (newProps.widthCols !== this.props.widthCols) {
      reflow = true;
    }
    redraw = this.diffPatchSeries(newProps) || redraw;
    if (reflow) { chart.reflow(); }
    if (redraw) { chart.redraw(false); }
  }

  diffPatchSeries(newProps) {
    const chart = this.state.chart;
    const oldSeries = this.getSeries(this.props);
    const newSeries = this.getSeries(newProps);
    const addedSeries = differenceBy(newSeries, oldSeries, s => s.id);
    const removedSeries = differenceBy(oldSeries, newSeries, s => s.id);
    const retainedSeries = intersectionBy(newSeries, oldSeries, s => s.id);
    let redraw = false;
    for (const series of removedSeries) {
      chart.get(series.id).remove(false);
      if (newProps.multiAxis) {
        chart.get(`${series.id}-axis`).remove(false);
      }
      redraw = true;
    }
    for (const series of addedSeries) {
      if (newProps.multiAxis) {
        chart.addAxis(this.getYAxis(series, newProps), false);
      }
      chart.addSeries(series, false);
      redraw = true;
    }
    for (const newVersion of retainedSeries) {
      const oldVersion = chart.get(newVersion.id);
      const colorChange = oldVersion.options.color !== newVersion.color;
      const addedPoints = differenceBy(newVersion.data, oldVersion.data, p => p.id);
      const removedPoints = differenceBy(oldVersion.data, newVersion.data, p => p.id);
      for (const point of removedPoints) {
        point.remove(false);
      }
      for (const point of addedPoints) {
        oldVersion.addPoint(point, false);
      }
      if (colorChange) {
        oldVersion.update({color: newVersion.color}, false);
      }
      redraw = redraw || addedPoints.length || removedPoints.length || colorChange;
    }
    return redraw;
  }

  getSeries(props) {
    return this.getSeriesArray(props).map(series => {
      const {type, title, data, color, id, yField, minValue, maxValue, dashStyle, lineWidth, pointPadding, groupPadding, borderWidth, marker} = series.props;
      return {
        id,
        name: title,
        type: type || 'line',
        data: data.map(point => ({
          id: `${id}-${point.get(props.xField)}-${point.get(yField)}`,
          x: point.get(props.xField),
          y: yField ? point.get(yField) : null,
          color: point.get("color", undefined)
        })).toJS(),
        yAxis: this.props.multiAxis ? `${id}-axis` : 0,
        dashStyle: dashStyle || 'ShortDot',
        color,
        marker: marker || {
          enabled: type === 'scatter',
          radius: 4
        },
        lineWidth: lineWidth || (type === 'line' ? 3 : 0),
        animation: false,
        showInLegend: this.isLegendVisible(props),
        minValue,
        maxValue,
        pointPadding: typeof pointPadding !== "undefined" ? pointPadding : 0.1,
        groupPadding: typeof groupPadding !== "undefined" ? groupPadding : 0.2,
        borderWidth
      };
    });
  }

  getYAxes(allSeries, props) {
    if (props.multiAxis) {
      return allSeries.map(s => this.getYAxis(s, props));
    } else if (allSeries.length) {
      return [this.getYAxis(allSeries[0], props)];
    } else {
      return [];
    }
  }

  getYAxis(series, props) {
    return {
      id: `${series.id}-axis`,
      title: this.props.yAxisTitle || {text: null},
      gridLineWidth: this.props.gridLineWidth || 1,
      gridLineColor: 'rgb(47, 51, 51)',
      labels: {
        enabled: this.isAxisLabelsVisible(props) && !props.hideYAxis,
        style:  this.props.yLabelStyle || {color: '#fff'},
      },
      opposite: props.yAxisOpposite,
      min: series.minValue || null,
      max: series.maxValue || null,
      lineWidth: props.yAxisWidth || 0,
      lineColor:  props.yAxisColor || '',
      tickPositioner: this.props.yTickPositioner,
      plotLines: this.props.yPlotLines,

    };
  }

  getSeriesArray(props = this.props) {
    return React.Children.toArray(props.children)
  }

  getXAxisLabelFormatter() {
    const formatter = this.props.xAxisLabelFormatter;
    return formatter && function() { return formatter(this.value, this.isFirst, this.isLast) }
  }

  isLegendVisible(props) {
    return props.size === Size.XLARGE;
  }

  isAxisLabelsVisible(props) {
    return props.size !== Size.SMALL
  }

}

Chart.propTypes = {
  size: PropTypes.oneOf(values(Size)).isRequired,
  widthCols: PropTypes.number.isRequired,
  xField: PropTypes.string,
  horizontal: PropTypes.bool,
  xAxisOpposite: PropTypes.bool,
  yAxisOpposite: PropTypes.bool,
  multiAxis: PropTypes.bool,
  xAxisLabelformatter: PropTypes.func,
  chartType: PropTypes.string
};

export default Chart;