import React, { Component, PropTypes } from 'react';
import { Map, List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './OperatingConditionApp.css';

class OperatingConditionApp extends Component {

  constructor(props) {
    super(props);
    this.state = {series: List()};
  }

  render() {
    return (
      <div className="c-pdm-operating-condition">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            xAxisTitle={{
              text: `Operating Differential Pressure Across Motor (${this.props.convert.getUnitDisplay('pressure')})`,
              style: { color: "#fff" }
            }}
            xAxisWidth="2"
            xAxisColor="white"
            xPlotLines={this.xPlotLines}
            horizontal={true}
            multiAxis={true}
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, type, yAxis, yAxisTitle, yAxisOpposite, data}) => (
              <ChartSeries
                key={title}
                id={title}
                type={renderType}
                title={title}
                data={data}
                yField="value"
                yAxis={yAxis}
                yAxisTitle={{
                  text: yAxisTitle,
                  style: { color: "#fff" }
                }}
                yAxisOpposite={yAxisOpposite}
                minValue={0.0}
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

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  get xPlotLines() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'limits']).toJSON();
    let transitionalDifferentialPressureLimit = {
      color: 'white',
      dashStyle: 'dash',
      label: {text: 'Transitional Differential Pressure Limit', style: {color: 'white'}},
      value: this.props.convert.convertValue(data.transitional_differential_pressure_limit, 'pressure', 'psi'),
      width: 2,
      zIndex: 5
    };
    let maxDifferentialPressure = {
      color: 'white',
      dashStyle: 'dash',
      label: {text: 'Max ODP', style: {color: 'white'}},
      value: this.props.convert.convertValue(data.max_differential_pressure, 'pressure', 'psi'),
      width: 2,
      zIndex: 5
    };
    let xPlotLines = [transitionalDifferentialPressureLimit, maxDifferentialPressure];
    return xPlotLines;
  }

  getSeries() {
    let dataList = [this.getTorqueSeries()];
    dataList = dataList.concat(this.getFlowRateSeries());
    return List(dataList);
  }

  getTorqueSeries() {
    const type = 'torque';
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'torque_line']).toJSON();
    return {
        renderType: SUPPORTED_CHART_SERIES[type].type,
        title: SUPPORTED_CHART_SERIES[type].label,
        type: type,
        yAxis: 0,
        yAxisOpposite: true,
        yAxisTitle: `Torque (${this.props.convert.getUnitDisplay('force')})`,
        data: List(this.formatSeriesData(data, 'torque', 'force', 'lbf'))
    };
  }

  getFlowRateSeries() {
    const type = 'rpm';
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'flow_rate_lines']).toJSON();
    return data.map((flowRateSeries) => {
      flowRateSeries.curve = this.props.convert.convertArray(
        flowRateSeries.curve, 'differential_pressure', 'pressure', 'psi');
      flowRateSeries.curve = flowRateSeries.curve.map((datum) => {
        return Map({
          measured_depth: datum.differential_pressure,
          value: datum.rpm
        });
      });
      let flowRate = this.props.convert.convertValue(flowRateSeries.flow_rate, 'volume', 'gal');
      let title = `RPM @ ${flowRate} ${this.props.convert.getUnitDisplay('volume')}pm`;
      return {
          renderType: SUPPORTED_CHART_SERIES[type].type,
          title: title,
          type: type,
          yAxis: 1,
          yAxisOpposite: false,
          yAxisTitle: 'RPM',
          data: List(flowRateSeries.curve)
      };
    });
  }

  formatSeriesData(data, valueName, valueCategory, valueUnit) {
    data = this.props.convert.convertArray(data, 'differential_pressure', 'pressure', 'psi');
    data = this.props.convert.convertArray(data, valueName, valueCategory, valueUnit);
    data = data.map((datum) => {
      return Map({
        measured_depth: datum.differential_pressure,
        value: datum[valueName]
      });
    });
    return data;
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

}

OperatingConditionApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OperatingConditionApp;
