import React, {Component} from 'react';
import Highcharts from 'highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find, merge } from 'lodash';

class ColumnChart extends Component {

  render() {
    return (
      <div style={{height: '100%'}} ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const chart = Highcharts.chart(this.container, {
      chart: {
        type: 'column',
        backgroundColor: null,
        borderWidth: null,
        plotBorderWidth: null
      },
      title: {
        text: this.props.title || null,
        style: this.props.titleStyle
      },
      xAxis: {
        visible: true,
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        tickLength: 0,
        minorTickLength: 0,
        minorGridLineWidth: 0,
        lineWidth: 0, 
        plotLines: this.props.xAxisLines ? this.props.xAxisLines.map(line => this.getPlotLine(line, {label: {rotation: 0}})).toJS() : []
      },
      yAxis: {
        visible: true,
        labels: {
          enabled: this.props.yAxisLabelsEnabled || false,
          style: this.props.yAxisLabelsStyle || {color: '#fff'}
        },
        title: this.props.yAxisTitle || null,
        gridLineWidth: 0,
        lineWidth: this.props.yAxisLineWidth || 0, 
        tickLength: 0,
        minorTickLength: 0,
        minorGridLineWidth: 0,
        plotLines: this.props.yAxisLines ? this.props.yAxisLines.map(line => this.getPlotLine(line, {label: {align: 'right'}})).toJS() : [],
        reversed: this.props.yAxisReversed || false
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        backgroundColor: null,
        symbolRadius: 0,
        itemStyle: {
          color: '#bbb',
          fontWeight: 'regular',
          fontSize: '11px'
        },
        enabled: this.props.legendEnabled || false
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormat: this.props.tooltipPointFormat || '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
            stacking: 'normal'
        }
      },
      credits: {
        enabled: false
      },
      series: this.getSeries(this.props.data) || []
    });
    this.setState({chart});
  }

  componentWillReceiveProps(newProps) {
    const chart = this.state.chart;
    if (!newProps.data.equals(this.props.data)) {
      const series = this.getSeries(this.props.data);
      chart.series.forEach(s => {
        const updated = find(series, {name: s.name});
        s.update(updated, false);
      });
      // while(chart.series.length > 0) {
      //   chart.series[0].remove(true);
      // }
      // series.forEach(s => {
      //   chart.addSeries(s, false);
      // });
    }
    if (!newProps.xAxisLines.equals(this.props.xAxisLines)) {
      const axis = chart.xAxis[0];
      axis.update({
        plotLines: newProps.xAxisLines ? newProps.xAxisLines.map(line => this.getPlotLine(line, {label: {rotation: 0}})).toJS() : []
      }, false);
    }
    if (!newProps.yAxisLines.equals(this.props.yAxisLines)) {
      const axis = chart.yAxis[0];
      axis.update({
        plotLines: newProps.yAxisLines ? newProps.yAxisLines.map(line => this.getPlotLine(line, {label: {align: 'right'}})).toJS() : []
      }, false);
    }
    chart.reflow();
    chart.redraw(false);
  }

  getSeries(data) {
    return data.map(m =>
      m.set('borderWidth', 0)
    ).toJS();
  }

  getPlotLine(data, options={}) {
    return merge({
      color: data.get('color') || '#bbb',
      value: data.get('value') || 0,
      width: 1,
      label: {
        text: data.get('text') || '',
        align: 'center',
        useHTML: true,
        style: {
          color: data.get('color') || '#bbb',
          fontSize: '11px'
        }
      },
      zIndex: 100
    }, options);
  }

}

ColumnChart.propTypes = {
  data: ImmutablePropTypes.list.isRequired,
  xAxisLines: ImmutablePropTypes.list,
  yAxisLines: ImmutablePropTypes.list
};

export default ColumnChart;
