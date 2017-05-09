import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import addHeatmap from 'highcharts/modules/heatmap';
import addData from 'highcharts/modules/data';
import { isEqual, values } from 'lodash';
import { Size } from './constants';

addData(Highcharts);
addHeatmap(Highcharts);

class Heatmap extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    let seriesMinMax = this.getSeriesMinMax(this.props.series);
    const heatmap = Highcharts.chart(this.container, {
      chart: {
        type: 'heatmap',
        backgroundColor: null,
        plotBorderWidth: 1,
        plotBorderColor: "rgb(32, 31, 31)",
        marginTop: 7
      },
      xAxis: {
        categories: this.props.xAxis["categories"],
        title: {
          text: this.props.xAxis["title"]
        },
        labels: {
          step: 3
        },
        tickWidth: 0,
        lineColor: "rgb(32, 31, 31)",
      },
      yAxis: {
        categories: this.props.yAxis["categories"],
        title: {
          text: this.props.yAxis["title"]
        },
        labels: {
          step: 4
        },
        opposite: true,
        lineColor: "rgb(32, 31, 31)",
      },
      title: {text: null},
      credits: {enabled: false},
      colorAxis: {
        stops: this.props.colorStops || [
          [0, '#ff0000'],
          [0.5, '#ffff00'],
          [1, '#00ff00']
        ],
        min: seriesMinMax.min,
        max: seriesMinMax.max,
      },
      tooltip: {
        formatter: this.props.tooltipFormatter,
        pointFormatter: this.props.tooltipPointFormatter,
        valuePrefix: this.props.tooltipValuePrefix,
        valueSuffix: this.props.tooltipValueSuffix,
        valueDecimals: 2
      },
      legend: {
        itemWidth: 200,
        itemDistance: 10,
        itemMarginBottom: 0,
        padding: 5,
        margin: 0,
        itemStyle: {
          fontSize: "8px",
        },
        symbolPadding: 0,
        align: 'right',
        verticalAlign: 'bottom',
        floating: true,
        y: 30,
        x: -10,      
      },
      series: [this.props.series]
    });
    this.setState({heatmap});
  }

  componentWillReceiveProps(newProps) {

    if (this.state && typeof this.state.heatmap === 'undefined') {
      return;
    }
    if (!isEqual(newProps.series, this.props.series)) {
      const heatmap = this.state.heatmap;
      heatmap.series[0].update(newProps.series);
    }

    if (newProps.coordinates !== this.props.coordinates) {
      const heatmap = this.state.heatmap;
      heatmap.enabled = this.isLegendVisible(newProps);
      heatmap.reflow();
      heatmap.redraw(false);
    }
  }

  getSeriesMinMax(series) {
    if (series.data.length === 0) {
      return {min: 0, max: 0};
    }
    let min = series.data[0][2] || 0;
    let max = series.data[0][2] || 0;
    for (let i = 1; i < series.data.length; i++) {
      min = Math.min(min, series.data[i][2]);
      max = Math.max(max, series.data[i][2]);
    }
    return {min, max};
  }

  isLegendVisible(props) {
    return props.showLegend && (props.size === Size.LARGE || props.size === Size.XLARGE);
  }

}

Heatmap.propTypes = {
  size: PropTypes.oneOf(values(Size)).isRequired,
  coordinates: PropTypes.object.isRequired,
  showLegend: PropTypes.bool,
  series: PropTypes.object.isRequired,
  yAxis: PropTypes.object.isRequired,
  xAxis: PropTypes.object.isRequired,
  colorStops: PropTypes.object.isRequired,
};

export default Heatmap;