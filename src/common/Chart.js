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
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: 'line',
        inverted: true,
        backgroundColor: null,
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        plotBackgroundColor: 'rgb(42, 46, 46)'
      },
      xAxis: {
        gridLineWidth: 1,
        gridLineColor: 'rgb(47, 51, 51)',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          visible: this.isAxisLabelsVisible(this.props),
          style: {color: '#fff'}
        }
      },
      yAxis: {
        title: {text: null},
        gridLineWidth: 1,
        gridLineColor: 'rgb(47, 51, 51)',
        labels: {
          visible: this.isAxisLabelsVisible(this.props),
          style: {color: '#fff'}
        }
      },
      title: {text: null},
      credits: {enabled: false},
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {color: '#fff'},
        enabled: true
      },
      series: this.getSeries(this.props)
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
        labels: {enabled: this.isAxisLabelsVisible(newProps)}
      });
      chart.yAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps)}
      });
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
      redraw = true;
    }
    for (const series of addedSeries) {
      chart.addSeries(series, false);
      redraw = true;
    }
    for (const series of retainedSeries) {
      const chartSeries = chart.get(series.id);
      const addedPoints = differenceBy(series.data, chartSeries.data, p => p.id);
      const removedPoints = differenceBy(chartSeries.data, series.data, p => p.id);
      for (const point of removedPoints) {
        point.remove(false);
      }
      for (const point of addedPoints) {
        chartSeries.addPoint(point, false);
      }
      redraw = redraw || addedPoints.length || removedPoints.length;
    }
    return redraw;
  }

  getSeries(props) {
    return React.Children.toArray(props.children).map(series => {
      const {type, title, data, color, id} = series.props;
      return {
        id,
        name: title,
        type,
        data: data.map(point => ({
          id: `${id}-${point.get(props.xField)}-${point.get(props.yField)}`,
          x: point.get(props.xField),
          y: point.get(props.yField)
        })).toJS(),
        dashStyle: 'ShortDot',
        color,
        marker: {
          enabled: type === 'scatter', radius: 4
        },
        lineWidth: type === 'line' ? 3 : 0,
        animation: false,
        showInLegend: this.isLegendVisible(props)
      }
    });
  }

  isLegendVisible(props) {
    return props.size === Size.XLARGE || props.size === Size.LARGE;
  }

  isAxisLabelsVisible(props) {
    return props.size !== Size.SMALL
  }

}

Chart.propTypes = {
  size: PropTypes.oneOf(values(Size)).isRequired,
  widthCols: PropTypes.number.isRequired
};

export default Chart;