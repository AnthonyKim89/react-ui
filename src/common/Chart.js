import React, {Component, PropTypes} from 'react';
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
          zoomType: 'xy',
          panning: true,
          panKey: 'shift',
          plotBackgroundColor: 'rgb(42, 46, 46)'
        },
        xAxis: {
          gridLineWidth: 1,
          gridLineColor: 'rgb(47, 51, 51)',
          lineWidth: 0,
          tickWidth: 0,
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
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {color: '#fff'},
          enabled: this.props.isLegendVisible
        },
        series: this.getSeries()
      }
    }
  }

  componentWillReceiveProps(props) {
    this.setState(state => {
      state.chartConfig.legend.enabled = props.isLegendVisible;
      state.chartConfig.xAxis.labels.enabled = props.isAxisLabelsVisible;
      state.chartConfig.yAxis.labels.enabled = props.isAxisLabelsVisible;
    });
  }

  render() {
    return <ReactHighcharts ref="chart"
                            config={this.state.chartConfig}
                            domProps={{style: {height: '100%'}}} />;
  }


  getSeries() {
    return React.Children.toArray(this.props.children).map(series => {
      const {type, title, data, color} = series.props;
      return {
        name: title,
        type,
        data: data.map(point => ([
          point.get(this.props.xField),
          point.get(this.props.yField)
        ])).toJS(),
        dashStyle: 'ShortDot',
        color,
        marker: {
          enabled: type === 'scatter', radius: 4
        },
        lineWidth: type === 'line' ? 3 : 0,
        animation: false
      }
    });
  }

}

Chart.propTypes = {
  isLegendVisible: PropTypes.bool,
  isAxisLabelsVisible: PropTypes.bool
};

export default Chart;