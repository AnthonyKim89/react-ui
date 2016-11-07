import React, {Component} from 'react';
import AmCharts from "amcharts3-react";
import "amcharts3/amcharts/xy.js";

class Chart extends Component {

  render() {
    const config = {
      type: 'xy',
      graphs: this.getGraphs(),
      valueAxes: [{
        position: 'left',
        reversed: true,
        gridColor: '#888',
        axisColor: '#888'
      }, {
        position: 'bottom',
        gridColor: '#888',
        axisColor: '#888'
      }],
      dataProvider: this.getDataProvider(),
      color: '#fff'
    };
    return <AmCharts {...config} />;
  }

  getGraphs() {
    return this.props.data.get('series').map(series => ({
      title: series.get('title'),
      xField: this.getSeriesXField(series),
      yField: this.props.yField,
      lineThickness: series.get('seriesType') === 'line' ? 2 : 0,
      bullet: series.get('seriesType') === 'bullet' ? 'round' : null
    })).toJS();
  }

  getDataProvider() {
    return this.props.data.get('series').reduce((allData, series) => {
      const seriesXField = this.getSeriesXField(series);
      return allData.concat(series.get('data').map(point => ({
        [seriesXField]: point.get(this.props.xField),
        [this.props.yField]: point.get(this.props.yField)
      })).toJS());
    }, []);
  }
  
  getSeriesXField(series) {
    return `${this.props.xField}-${series.get('type')}-${series.get('measurement')}`;
  }

}

export default Chart;