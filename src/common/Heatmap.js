import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Heatmap extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const heatmap = Highcharts.chart(this.container, {
      chart: {
        type: 'heatmap',
        backgroundColor: null,
        plotBackgroundColor: 'rgb(42, 46, 46)',
      },
      xAxis: this.getXAxis(this.props),
      yAxis: this.getYAxis(this.props),
      title: {text: null},
      credits: {enabled: false},
      legend: {enabled: false},
      series: this.getSeries(this.props)
    });
    this.setState({heatmap});
  }

  componentWillReceiveProps(newProps) {
    const heatmap = this.state.heatmap;
    heatmap.reflow();
    heatmap.redraw(false);
  }

  getXAxis(props) {
    let data = props.data.get("data");
    let columnWidth = (data.get("x_axis").get("maximum") - data.get("x_axis").get("minimum"))/data.get("x_axis").get("columns");
    return {
      categories: this.getAxisData(data.get("x_axis").get("minimum"), columnWidth, data.get("x_axis").get("columns")),
      title: data.get("x_axis").get("type").toUpperCase()
    }
}

  getYAxis(props) {
    let data = props.data.get("data");
    let rowHeight = (data.get("y_axis").get("maximum") - data.get("y_axis").get("minimum"))/data.get("y_axis").get("rows");
    return {
      categories: this.getAxisData(data.get("y_axis").get("minimum"), rowHeight, data.get("y_axis").get("rows")),
      title: data.get("y_axis").get("type").toUpperCase()
    }
  }

  getAxisData(start, unitWidth, axisLength) {
    let data = [];
    for (let i = 0; i < axisLength; i++) {
      let nextStart = start + unitWidth;
      data.push(start.toFixed(1) + " - " + (nextStart-.1).toFixed(1))
      start = nextStart;
    }
    return data;
  }

  getSeries(props) {
    let data = props.data.get("data");
    let series = [];
    for (let y = 0; y < data.get("y_axis").get("rows"); y++) {
      let row = data.get(props.dataNode).get(y);
      for (let x = 0; x < data.get("x_axis").get("columns"); x++) {
        let z = row.get(x);
        series.push([y, x, z]);
      }
    }
    return {data: series};
  }
}

Heatmap.propTypes = {
  data: ImmutablePropTypes.map.isRequired,
  dataNode: PropTypes.string.isRequired,
};

export default Heatmap;