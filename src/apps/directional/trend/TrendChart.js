import React, { Component, PropTypes } from 'react';
import Highcharts from 'highcharts';
class TrendChart extends Component {

  render() {    
    return (      
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentWillReceiveProps(newProps) {
    Highcharts.chart(this.container, {
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
              text: 'Measure Depth (ft)',
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
      yAxis: newProps.yAxes.map( y=> {

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

      }),

      series: newProps.series
    });
  }

}

TrendChart.propTypes = {
	series: PropTypes.array,
	yAxes: PropTypes.array
};
export default TrendChart;

