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
        backgroundColor: null,
        plotBackgroundColor: 'rgb(42, 46, 46)',
        inverted: true,
      },
      xAxis: {
        title: {
          text: 'Value'
        },
        lineWidth: 2,
      },
      yAxis: {
        title: {
          text: 'Depth'
        },
        lineWidth: 2,
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
  series: PropTypes.array.isRequired
};

export default ObjectGraph;