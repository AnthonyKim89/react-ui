import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';

class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartConfig: {
        chart: {
          type: 'line',
          inverted: true,
          backgroundColor: null,
          plotBackgroundColor: 'rgb(42, 46, 46)'
        },
        xAxis: {
          gridLineWidth: 1,
          gridLineColor: 'rgb(47, 51, 51)',
          lineWidth: 3,
          labels: {
            style: {color: '#fff'}
          }
        },
        yAxis: {
          title: {text: null},
          gridLineWidth: 1,
          gridLineColor: 'rgb(47, 51, 51)',
          labels: {
            style: {color: '#fff'}
          }
        },
        title: {text: null},
        credits: {enabled: false},
        legend: {itemStyle: {color: '#fff'}},
        series: this.getSeries()
      }
    }
  }

  render() {
    return <ReactHighcharts config={this.state.chartConfig}
                            domProps={{style: {height: '100%'}}} />;
  }

  getSeries() {
    return this.props.data.get('series').map(series => {
      const type = series.get('seriesType');
      return {
        name: series.get('title'),
        type,
        data: series.get('data').map(point => ([
          point.get(this.props.xField),
          point.get(this.props.yField)
        ])).toJS(),
        dashStyle: 'ShortDash',
        lineWidth: type === 'line' ? 3 : 0,
        animation: false
      }
    }).toJS();
  }

}

export default Chart;