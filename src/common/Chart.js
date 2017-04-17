import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import { difference, find, intersection, differenceBy, values, uniqBy } from 'lodash';
import { Size } from './constants';

class Chart extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const series = this.getAllSeries(this.props);
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: this.props.chartType || 'line',
        inverted: !this.props.horizontal,
        backgroundColor: null,
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        plotBackgroundColor: this.props.plotBackgroundColor || 'rgb(42, 46, 46)',
        spacing: this.props.noSpacing ? [0, 0, 0, 0] : [10, 10, 15, 10],
        marginBottom: this.props.marginBottom,
        marginLeft: this.props.marginLeft,
        marginRight: this.props.marginRight,
        marginTop: this.props.marginTop,
      },
      tooltip: {
        formatter: this.props.tooltipFormatter,
        pointFormat: this.props.tooltipPointFormat || `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>`,
        pointFormatter: this.props.tooltipPointFormatter,
        valuePrefix: this.props.tooltipValuePrefix,
        valueSuffix: this.props.tooltipValueSuffix,
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
          formatter: this.getXAxisLabelFormatter(),
          reserveSpace: this.props.reserveXLabelSpace
        },
        showFirstLabel: this.props.showFirstXLabel,
        showLastLabel: this.props.showLastXLabel,
        opposite: this.props.xAxisOpposite,
        tickPositioner: this.props.xTickPositioner,
        plotLines: this.props.xPlotLines,
        type: this.props.xAxisType
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
    } else if (newProps.widthCols !== this.props.widthCols || (this.props.coordinates && (newProps.coordinates !== this.props.coordinates))) {
      reflow = true;
    }
    redraw = this.diffPatchSeries(newProps) || redraw;
    if (reflow) { chart.reflow(); }
    if (redraw) { chart.redraw(false); }
  }

  diffPatchSeries(newProps) {
    const chart = this.state.chart;
    const {added, removed, retained} = this.getSeriesDiff(newProps, this.props);
    let redraw = false;
    for (const seriesId of removed) {
      chart.get(seriesId).remove(false);
      if (newProps.multiAxis) {
        chart.get(`${seriesId}-axis`).remove(false);
      }
      redraw = true;
    }
    for (const seriesId of added) {
      const series = this.getSeries(newProps, seriesId);
      if (newProps.multiAxis) {
        chart.addAxis(this.getYAxis(series, newProps), false);
      }
      chart.addSeries(series, false);
      redraw = true;
    }
    for (const seriesId of retained) {
      const oldVersion = chart.get(seriesId);
      const newVersion = this.getSeries(newProps, seriesId);
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

  getSeriesDiff(newProps, previousProps) {
    const newSeriesIds = React.Children.map(newProps.children, s => s.props.id);
    const previousSeriesIds = React.Children.map(previousProps.children, s => s.props.id);
    return {
      added: difference(newSeriesIds, previousSeriesIds),
      removed: difference(previousSeriesIds, newSeriesIds),
      retained: intersection(newSeriesIds, previousSeriesIds)
    };
  }

  getSeries(props, id) {
    const children = React.Children.toArray(props.children);
    const child = find(children, s => s.props.id === id);
    return this.getSeriesFromChild(child, props);
  }

  getAllSeries(props) {
    return React.Children.map(props.children, child => this.getSeriesFromChild(child, props));
  }

  getSeriesFromChild(child, props) {
    const {type, title, data, color, id, yField, yAxis, yAxisTitle, yAxisOpposite, minValue, maxValue, dashStyle, lineWidth, pointPadding, groupPadding, borderWidth, marker, fillOpacity} = child.props;
    return {
      id,
      name: title,
      type: type || 'line',
      data: data.reduce((result, point) => {
        const x = point.get(props.xField);
        const y = yField ? point.get(yField) : null;
        const color = point.get('color');
        const pointId = `${id}-${x}-${y}`;
        result.push({id: pointId, x, y, color});
        return result;
      }, []),
      yAxis: props.multiAxis ? yAxis : 0,
      yAxisTitle: yAxisTitle,
      yAxisOpposite: yAxisOpposite,
      dashStyle: dashStyle || 'solid',
      color,
      fillOpacity: fillOpacity || 0.75,
      marker: marker || {
        enabled: type === 'scatter',
        radius: 3,
        symbol: "circle"
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
  }

  getYAxes(allSeries, props) {
    if (props.multiAxis) {
      return uniqBy(allSeries.map(s => this.getYAxis(s, props)), 'id');
    } else if (allSeries.length) {
      return [this.getYAxis(allSeries[0], props)];
    } else {
      return [];
    }
  }

  getYAxis(series, props) {
    return {
      id: series.yAxis,
      title: series.yAxisTitle || props.yAxisTitle || {text: null},
      visible: this.isAxisLabelsVisible(props),
      gridLineWidth: props.gridLineWidth || 1,
      gridLineColor: 'rgb(47, 51, 51)',
      labels: {
        enabled: this.isAxisLabelsVisible(props) && !props.hideYAxis,
        style:  props.yLabelStyle || {color: '#fff'},
        formatter: props.yAxisLabelFormatter,
        useHTML: true,
        reserveSpace: props.reserveYLabelSpace
      },
      opposite: series.yAxisOpposite ? series.yAxisOpposite : props.yAxisOpposite,
      min: series.minValue || null,
      max: series.maxValue || null,
      lineWidth: props.yAxisWidth || 0,
      lineColor:  props.yAxisColor || '',
      tickPositioner: props.yTickPositioner,
      plotLines: props.yPlotLines,
      reversed: props.yAxisReversed || false,
      showFirstLabel: props.showFirstYLabel,
      showLastLabel: props.showLastYLabel,
      type: this.props.yAxisType
    };
  }

  getXAxisLabelFormatter() {
    const formatter = this.props.xAxisLabelFormatter;
    return formatter && function() {
        return formatter(this.value, this.isFirst, this.isLast);
      };
  }

  isLegendVisible(props) {
    return props.showLegend && (props.size === Size.XLARGE);
  }

  isAxisLabelsVisible(props) {
    return props.size !== Size.SMALL;
  }
}

Chart.defaultProps = {
  showLegend: true,
};

Chart.propTypes = {
  size: PropTypes.oneOf(values(Size)).isRequired,
  coordinates: PropTypes.object,
  widthCols: PropTypes.number.isRequired,
  xField: PropTypes.string,
  horizontal: PropTypes.bool,
  xAxisOpposite: PropTypes.bool,
  yAxisOpposite: PropTypes.bool,
  multiAxis: PropTypes.bool,
  xAxisLabelformatter: PropTypes.func,
  showLegend: PropTypes.bool, 
  chartType: PropTypes.string,
  noSpacing: PropTypes.bool
};

export default Chart;
