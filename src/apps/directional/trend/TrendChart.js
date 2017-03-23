import React, { Component, PropTypes } from 'react';
import Highcharts from 'highcharts';
import { isEqual } from 'lodash'

class TrendChart extends Component {

  render() {
    return (
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    let chart = Highcharts.chart(this.container, {
      chart: {
        backgroundColor: null,
        plotBackgroundColor: 'rgb(42, 46, 46)',
      },
      credits: {enabled: false},
      title: "",
      legend:{
      	itemStyle:{
      		color:'#ffffff'
      	}
      },
      plotOptions: {
        series: {
          animation: false
        }
      },
      xAxis: {
          title: {
              enabled: true,
              text: 'Measure Depth ('+this.props.convert.GetUnitDisplay('length')+')',
              style: {
              	color:'#ffffff'
              }
          },
          labels:{
          	style:{
          		color:'#ffffff'
          	}
          },
          gridLineWidth: 1,
          gridLineColor: 'rgb(150, 150, 150)',
          tickWidth: 0,
      },      
      yAxis: this.generateYAxis(this.props.yAxes),
      series: this.props.series
    });
    this.setState({chart});
  }

  generateYAxis(yAxes) {
    return yAxes.map(y => {
      let yAxe = {
        title: {
          text: y.titleText,
          style: {
            color: y.color
          }
        },
        labels: {
          style : {
            color: '#ffffff'
          },
          format: '{value}'
        },
        gridLineWidth: 1,
        gridLineColor: 'rgb(150, 150, 150)',
      };
      for (let prop in y.others) {
        if (y.others.hasOwnProperty(prop)) {
          yAxe[prop] = y.others[prop];
        }
      }
      return yAxe;
    });
  }

  componentWillReceiveProps(newProps) {
    if (typeof this.state.chart === 'undefined') {
      return;
    }
    let updated = false;
    const chart = this.state.chart;

    if (!isEqual(newProps.series, this.props.series)) {
      updated = true;
      for (let i = 0; i < newProps.series.length; i++) {
        chart.series[i].update(newProps.series[i], false);
      }
    }

    if (!isEqual(newProps.yAxes, this.props.yAxes)) {
      updated = true;
      chart.yAxis.update(this.generateYAxis(newProps.yAxes));
    }

    if (updated) {
      chart.redraw(false);
    }
  }
}

TrendChart.propTypes = {
	series: PropTypes.array,
	yAxes: PropTypes.array
};
export default TrendChart;

