import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import addHeatmap from 'highcharts/modules/heatmap';
import addData from 'highcharts/modules/data';

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
        marginTop: 60,
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
      title: {
        align: "left",
        text: this.props.title,
        style: {
          color: "white",
          "font-weight": 900,
          "font-size": "1.45rem",
          "font-family": "Open Sans",
          "letter-spacing": "0.5px",
        },
        y: 20,
      },
      credits: {enabled: false},
      colorAxis: {
        stops: [
          [0, '#ff0000'],
          [0.5, '#ffff00'],
          [1, '#00ff00']
        ],
        min: seriesMinMax.min,
        max: seriesMinMax.max,
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        floating: true,
        y: 3,
        x: -50,
      },
      series: [this.props.series]
    });
    this.setState({heatmap});
  }

  componentWillReceiveProps(newProps) {
    if (typeof this.state.heatmap === 'undefined') {
      return;
    }
    if (newProps.data !== this.props.data) {
      const heatmap = this.state.heatmap;
      heatmap.series[0].update(newProps.series);
    }
  }

  getSeriesMinMax(series) {
    let min = series.data[0][2];
    let max = series.data[0][2];
    for (let i = 1; i < series.data.length; i++) {
      min = Math.min(min, series.data[i][2]);
      max = Math.max(max, series.data[i][2]);
    }
    return {min, max};
  }
}

Heatmap.propTypes = {
  series: PropTypes.object.isRequired,
  yAxis: PropTypes.object.isRequired,
  xAxis: PropTypes.object.isRequired,
};

export default Heatmap;