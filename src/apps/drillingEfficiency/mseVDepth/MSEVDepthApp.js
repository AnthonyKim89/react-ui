import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List } from 'immutable';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MSEVDepthApp.css';

class MSEVDepthApp extends Component {

  render() {
    return (
      <div className="c-de-mse-v-depth">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <Chart
            xField="measured_depth"
            xAxisTitle={{text:`Measured Depth (${this.props.convert.getUnitDisplay('length')})`, style: { color: "#fff" }}}
            coordinates={this.props.coordinates}
            xAxisWidth="2"
            xAxisColor="white"
            horizontal={true}
            multiAxis={true}
            legendAlign='center'
            legendVerticalAlign='bottom'
            legendLayout='horizontal'
            showLegend={true}
            forceLegend={true}
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, type, yAxis, yAxisTitle, yAxisOpposite, yField, data}) => (
              <ChartSeries
                key={title}
                id={title}
                type={renderType}
                title={title}
                data={data}
                yField={yField}
                yAxis={yAxis}
                yAxisTitle={{text:yAxisTitle, style: { color: "#fff" }}}
                yAxisOpposite={yAxisOpposite}
                color={this.getSeriesColor(type)} />
            )).toJS()}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }

  formatYLabel() {
    let unit = this.props.convert.getUnitDisplay('length');
    return (
      function() {
        return '<span class="c-de-mse-v-depth-x-label">' + this.value + '</span>' + unit;
      }
    );
  }


  getSeries() {
    return List([this.getSurfaceMSESeries(), this.getDownholeMSESeries(), this.getUCSSeries(), this.getROPSeries()]);
  }

  getSurfaceMSESeries() {
    const type = 'surface';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: "0",
        yField: "mse",
        yAxisOpposite: false,
        yAxisTitle: `Pressure (${this.props.convert.getUnitDisplay('pressure')})`,
        data: List(this.getSeriesData('surface', 'pressure', 'psi'))
    };
  }

  getDownholeMSESeries() {
    const type = 'downhole';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: "0",
        yField: "mse",
        yAxisOpposite: false,
        yAxisTitle: `Pressure (${this.props.convert.getUnitDisplay('pressure')})`,
        data: List(this.getSeriesData('downhole', 'pressure', 'psi'))
    };
  }

  getUCSSeries() {
    const type = 'ucs';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: "0",
        yField: "ucs",
        yAxisOpposite: false,
        yAxisTitle: `Pressure (${this.props.convert.getUnitDisplay('pressure')})`,
        data: List(this.getSeriesData('ucs', 'pressure', 'psi'))
    };
  }

  getROPSeries() {
    const type = 'rop';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: "1",
        yField: "rop",
        yAxisOpposite: false,
        yAxisTitle: `ROP (${this.props.convert.getUnitDisplay('length')}/hr)`,
        data: List(this.getSeriesData('rop', 'pressure', 'psi'))
    };
  }

  getSeriesData(seriesName, valueCategory, valueUnit) {
    let data = subscriptions.selectors.firstSubData(
        this.props.data, SUBSCRIPTIONS).getIn(['data', seriesName]).toJSON();
    data = this.props.convert.convertImmutables(data, 'measured_depth', 'length', 'ft');
    data = this.props.convert.convertImmutables(data, seriesName, valueCategory, valueUnit);
    data = data.map((datum) => {
      return Map(datum);
    });
    return data;
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

}

MSEVDepthApp.propTypes = {
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
};

export default MSEVDepthApp;
