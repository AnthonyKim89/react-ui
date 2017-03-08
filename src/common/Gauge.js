import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';

highchartsMore(Highcharts);
solidGauge(Highcharts);

class Gauge extends Component {

  render() {
    
    // TODO get the width and height from props
    const gaugeContainerStyle = {
      width:200,
      height:200
    }

    return (
      <div style={gaugeContainerStyle} ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: 'gauge',
        height: 200,
        backgroundColor: null
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: null,
          borderWidth: 15,
          borderColor: 'rgb(68, 72, 84)',
          outerRadius: '110%'
        }]
      },
      yAxis: {
        min: 0,
        max: 30,
        tickLength: 0,
        minorTickLength: 0,
        lineWidth: 0,
        labels: {
          enabled: false
        },
        plotBands: [{
          from: this.props.bands.green.from,
          to: this.props.bands.green.to,
          color: 'rgb(132, 191, 85)',
          thickness: 30
        }, {
          from: this.props.bands.yellow.from,
          to: this.props.bands.yellow.to,
          color: 'rgb(234, 202, 69)',
          thickness: 30
        }, {
          from: this.props.bands.red.from,
          to: this.props.bands.red.to,
          color: 'rgb(255, 40, 79)',
          thickness: 30
        }]
      },
      plotOptions: {
        gauge: {
          dial: {
            baseWidth: 30,
            baseLength: '5%',
            rearLength: 0,
            backgroundColor: 'white'
          },
          pivot: {
            backgroundColor: 'white',
            radius: 15
          },
        }
      },
      series: [{
        data: [{id: 'pt', y: this.props.value}],
        dataLabels: []
      }],
      title: {text: null},
      credits: {enabled: false},
      tooltip: {enabled: false}
    });
    this.setState({chart});
  }

  componentWillReceiveProps(newProps) {
    const chart = this.state.chart;
    const point = chart.get('pt');
    point.update({y: newProps.value});
  }

}

Gauge.propTypes = {
  widthCols: PropTypes.number.isRequired,
  bands: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired
};

export default Gauge;