import React, {Component, PropTypes} from 'react';
import Highcharts from 'highcharts';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { values } from 'lodash';
import { Size } from './constants';


class PieChart extends Component {

  render() {
    return (
      <div style={{height: '100%'}} ref={container => this.container = container} />
    );
  }

  componentDidMount() {
    const chart = Highcharts.chart(this.container, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        backgroundColor: null,
        margin: 0,
        type: 'pie'
      },
      title: {
        text: this.props.title || null,
        align: this.props.titleAlign || 'center',
        verticalAlign: this.props.titleVerticalAlign || 'top', 
        style: {'color': '#bbb', 'fontFamily': 'orgonlightregular', 'fontSize': this.props.titleFontSize || '16px'}
      },
      tooltip: {
        pointFormat: this.props.showTooltipInPercentage ? '<b>{point.percentage:.1f}%</b>' : '<b>{point.y}' + this.props.unit + '</b>'
      },
      plotOptions: {
        pie: Object.assign({
          size: '100%',
          slicedOffset: 0,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          }
        }, this.props.pieOptions)
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        itemStyle: {color: '#fff'},
        enabled: true,
      },
      series: [{
        name: this.props.name || '',
        colorByPoint: true,
        borderColor: null,
        data: this.props.data.toJS() || []
      }],
      credits: {enabled: false}
    });
    this.setState({chart});
  }


  componentWillReceiveProps(newProps) {
    const chart = this.state.chart;
    if (newProps.data !== this.props.data) chart.series[0].setData(newProps.data.toJS());
    if (newProps.unit !== this.props.unit) {
      chart.series[0].update({
        tooltip: {
          pointFormat: newProps.showTooltipInPercentage ? '<b>{point.percentage:.1f}%</b>': '<b>{point.y}' + newProps.unit + '</b>'
        }
      }, false);
    }

    if (newProps.size !== this.props.size && newProps.showLegend) {
      const legendVisible = this.isLegendVisible(newProps);
      for (let i = 0 ; i < chart.series.length ; i++) {
        chart.series[i].update({showInLegend: legendVisible}, false);
      }
    }

    chart.reflow();
    chart.redraw(false);

  }

  isLegendVisible(props) {
    return props.showLegend && (props.size === Size.LARGE || props.size === Size.XLARGE);
  }

}

PieChart.propTypes = {
  size: PropTypes.oneOf(values(Size)).isRequired,
  data: ImmutablePropTypes.list.isRequired,
  title: PropTypes.string,
  titleAlign: PropTypes.oneOf(['left', 'center', 'right']),
  titleVerticalAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
  titleFontSize: PropTypes.string,
  name: PropTypes.string,
  showTooltipInPercentage: PropTypes.bool,
  showLegend: PropTypes.bool,
  unit: PropTypes.string
};

export default PieChart;
