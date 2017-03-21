import React, { Component, PropTypes } from 'react';
import Highcharts from 'highcharts';
class WellPlanChart extends Component {

  render() {    
    return (      
      <div style={{height: '100%'}}
           ref={container => this.container = container} />
    );
  }

  componentDidMount() {

    Highcharts.chart(this.container, {
      chart: {        
        backgroundColor: null,
        plotBackgroundColor: 'rgb(42, 46, 46)',
        type:'line'
      },
      credits: {enabled: false},
      title: "",
      legend:{
      	itemStyle:{
      		color:'#ffffff'
      	}
      },
      xAxis: {
        title: {
            enabled: true,
            text: 'Vertical Section',
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
      },
      yAxis: {
      	title: {
            enabled: true,
            text: 'True Vertical Depth',
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
        reversed:true  
      },
      series: this.props.series
    });

  }
}

WellPlanChart.propTypes = {
  series: PropTypes.array,
}
export default WellPlanChart;

