import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import addHeatmap from 'highcharts/modules/heatmap';
import addData from 'highcharts/modules/data';
import ImmutablePropTypes from 'react-immutable-proptypes';

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
    let series = this.getSeries(this.props);
    let seriesMinMax = this.getSeriesMinMax(series);

    const heatmap = Highcharts.chart(this.container, {
      chart: {
        type: 'heatmap',
        backgroundColor: null,
        plotBorderWidth: 1,
        plotBorderColor: "rgb(32, 31, 31)",
        marginTop: 60,
      },
      xAxis: this.getXAxis(this.props),
      yAxis: this.getYAxis(this.props),
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
      series: [series]
    });
    this.setState({heatmap});
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data !== this.props.data) {
      const heatmap = this.state.heatmap;
      heatmap.series[0].update(this.getSeries(newProps));
    }
  }

  getXAxis(props) {
    let data = props.data.get("data");
    let axis = data.get("x_axis");
    let columnWidth = (axis.get("maximum") - axis.get("minimum"))/axis.get("columns");
    return {
      categories: this.getAxisData(axis.get("minimum"), columnWidth, axis.get("columns")),
      title: {
        text: axis.get("type").toUpperCase()
      },
      labels: {
        step: 3
      },
      tickWidth: 0,
      lineColor: "rgb(32, 31, 31)",
    };
  }

  getYAxis(props) {
    let data = props.data.get("data");
    let axis = data.get("y_axis");
    let rowHeight = (axis.get("maximum") - axis.get("minimum"))/axis.get("rows");
    return {
      categories: this.getAxisData(axis.get("minimum"), rowHeight, axis.get("rows")),
      title: {
        text: axis.get("type").toUpperCase()
      },
      labels: {
        step: 4
      },
      opposite: true,
      lineColor: "rgb(32, 31, 31)",
    };
  }

  getAxisData(start, unitSize, axisLength) {
    let data = [];
    for (let i = 0; i < axisLength; i++) {
      let nextStart = start + unitSize;
      data.push(Math.round(start));
      start = nextStart;
    }
    return data;
  }

  getSeries(props) {
    let data = props.data.get("data");
    let series = [];
    let rows = data.get("y_axis").get("rows");
    let columns = data.get("x_axis").get("columns");
    for (let y = 0; y < rows; y++) {
      let row = data.get(props.dataNode).get(y);
      for (let x = 0; x < columns; x++) {
        let z = row.get(x);
        series.push([y, x, z]);
      }
    }
    return {
      name: "ROP",
      data: series,
      borderWidth: 1,
      borderColor: "#444444",
      nullColor: "#535353"
    };
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
  data: ImmutablePropTypes.map.isRequired,
  dataNode: PropTypes.string.isRequired,
};

export default Heatmap;