import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';

// This graph expects that series' will be provided as an array of objects containing x/y and a label and/or color:
/*
  data: [{
    x: 1,
    y: 10,
    name: "Point2",
    color: "#00FF00"
  }, {
    x: 1,
    y: 6,
    name: "Point1",
    color: "#FF00FF"
  }]
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
    if (typeof this.state.graph !== 'undefined') {
      for (let i = 0; i < this.state.graph.series.length; i++) {
        this.state.graph.series[i].update(newProps.series[i]);
      }
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