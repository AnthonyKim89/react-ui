import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';

highchartsMore(Highcharts);
solidGauge(Highcharts);

class Gauge extends Component {

  render() {
    return (
      <div ref={container => this.container = container} />
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
          from: 0,
          to: 10,
          color: 'rgb(132, 191, 85)', // green
          thickness: 30
        }, {
          from: 10,
          to: 20,
          color: 'rgb(234, 202, 69)', // yellow
          thickness: 30
        }, {
          from: 20,
          to: 30,
          color: 'rgb(255, 40, 79)', // red
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
          }
        }
      },
      series: [{
        name: 'Speed',
        data: [15],
        dataLabels: []
      }],
      title: {text: null},
      credits: {enabled: false}
    });
    this.setState({chart});
  }

  componentWillReceiveProps(newProps) {
    /*const chart = this.state.chart;
    let redraw = false, reflow = false;
    if (newProps.size !== this.props.size) {
      const legendVisible = this.isLegendVisible(newProps);
      for (let i = 0 ; i < chart.series.length ; i++) {
        chart.series[i].update({showInLegend: legendVisible}, false);
      }
      chart.xAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps)}
      }, false);
      chart.yAxis[0].update({
        labels: {enabled: this.isAxisLabelsVisible(newProps)}
      }, false);
      reflow = true;
      redraw = true;
    } else if (newProps.widthCols !== this.props.widthCols) {
      reflow = true;
    }
    redraw = this.diffPatchSeries(newProps) || redraw;
    if (reflow) { chart.reflow(); }
    if (redraw) { chart.redraw(false); }*/
  }

}

Gauge.propTypes = {
  widthCols: PropTypes.number.isRequired,
};

export default Gauge;