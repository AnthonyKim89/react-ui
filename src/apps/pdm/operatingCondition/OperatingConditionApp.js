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
            xField="differential_pressure"
            xAxisTitle={{
              text: `Operating Differential Pressure Across Motor (${this.props.convert.getUnitDisplay('pressure')})`,
              style: { color: "#fff" }
            }}
            xAxisWidth="2"
            xAxisColor="white"
            xPlotLines={this.xPlotLines}
            xPlotBands={this.xPlotBands}
            xMaxValue={this.maxVisibleDifferentialPressure}
            horizontal={true}
            multiAxis={true}
            forceLegend={true}
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, type, yAxis, yAxisTitle, yAxisOpposite, data, dashStyle}) => (
              <ChartSeries
                key={title}
                id={title}
                type={renderType}
                title={title}
                data={data}
                dashStyle={dashStyle}
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
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors))
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  /**
   * Get the max visible differential pressure.
   *
   * The API returns a max differential pressure that is domain focused.
   * This getter returns a value intended to bound the visible plot area.
   */
  get maxVisibleDifferentialPressure() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'torque_line']);
    return data.last().get('differential_pressure');
  }

  /**
   * Get the actual differential pressure in the proper unit.
   */
  get actualDifferentialPressure() {
    let differentialPressure = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'differential_pressure']);
    return this.props.convert.convertValue(differentialPressure, 'pressure', 'psi');
  }

  /**
   * Get the actual torque in the proper unit.
   */
  get actualTorque() {
    let torque = subscriptions.selectors.firstSubData(
      this.props.data,
      SUBSCRIPTIONS).getIn(['data', 'torque']
    );
    return this.props.convert.convertValue(torque, 'torque', 'ft-klbf');
  }

  get xPlotBands() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'limits']).toJSON();
    let transitionalDifferentialPressureLimit = this.props.convert.convertValue(
        data.transitional_differential_pressure_limit, 'pressure', 'psi');
    let maxDifferentialPressure = this.props.convert.convertValue(
        data.max_differential_pressure, 'pressure', 'psi');
    let transitionalDifferentialPressureLimitBand = {
      color: 'rgba(255, 255, 0, 0.25)',
      from: transitionalDifferentialPressureLimit,
      to: maxDifferentialPressure,
      zIndex: 2
    };
    let maxDifferentialPressureBand = {
      color: 'rgba(255, 0, 0, 0.25)',
      from: maxDifferentialPressure,
      // This little hack ensures that the band extends beyond the plot area.
      to: maxDifferentialPressure * 2,
      zIndex: 2
    };
    let xPlotBands = [transitionalDifferentialPressureLimitBand, maxDifferentialPressureBand];
    return xPlotBands;
  }

  get xPlotLines() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).get('data').toJSON();
    let actualDifferentialPressure = {
      color: 'white',
      label: {text: 'Actual ODP', style: {color: 'white'}},
      value: this.props.convert.convertValue(data.differential_pressure, 'pressure', 'psi'),
      width: 3,
      zIndex: 5
    };
    let transitionalDifferentialPressureLimit = {
      color: 'rgba(0, 0, 0, 0)',
      dashStyle: 'dash',
      label: {text: 'Transitional Differential Pressure Limit', style: {color: 'white'}},
      value: this.props.convert.convertValue(data.limits.transitional_differential_pressure_limit, 'pressure', 'psi'),
      width: 2,
      zIndex: 5
    };
    let maxDifferentialPressure = {
      color: 'rgba(0, 0, 0, 0)',
      dashStyle: 'dash',
      label: {text: 'Max ODP', style: {color: 'white'}},
      value: this.props.convert.convertValue(data.limits.max_differential_pressure, 'pressure', 'psi'),
      width: 2,
      zIndex: 5
    };
    let xPlotLines = [
      actualDifferentialPressure,
      transitionalDifferentialPressureLimit,
      maxDifferentialPressure
    ];
    return xPlotLines;
  }

  getSeries() {
    let dataList = [this.getTorqueSeries()];
    dataList = dataList.concat(this.getFlowRateSeries());
    dataList = dataList.concat([
      this.getActualRpmSeries(),
      this.getActualTorqueSeries()
    ]);
    return List(dataList);
  }

  getTorqueSeries() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'torque_line']).toJSON();
    return Object.assign(this.torqueAxis, {
      data: List(this.formatSeriesData(data, 'torque', 'torque', 'ft-klbf'))
    });
  }

  get torqueAxis() {
    const type = 'torque';
    return {
        renderType: SUPPORTED_CHART_SERIES[type].type,
        title: SUPPORTED_CHART_SERIES[type].label,
        type: type,
        yAxis: 0,
        yAxisOpposite: true,
        yAxisTitle: `Torque (${this.props.convert.getUnitDisplay('torque')})`,
        dashStyle: 'Solid'
    };
  }

  getFlowRateSeries() {
    let data = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'flow_rate_lines']).toJSON();
    return data.map((flowRateSeries) => {
      flowRateSeries.curve = this.props.convert.convertArray(
        flowRateSeries.curve, 'differential_pressure', 'pressure', 'psi');
      flowRateSeries.curve = flowRateSeries.curve.map((datum) => {
        return Map({
          differential_pressure: datum.differential_pressure,
          value: datum.rpm
        });
      });
      let flowRate = this.props.convert.convertValue(flowRateSeries.flow_rate, 'volume', 'gal');
      let title = `RPM @ ${flowRate} ${this.props.convert.getUnitDisplay('volume')}pm`;
      return Object.assign(this.flowRateAxis, {
        data: List(flowRateSeries.curve),
        title: title
      });
    });
  }

  get flowRateAxis() {
    const type = 'rpm';
    return {
      renderType: SUPPORTED_CHART_SERIES[type].type,
      title: 'RPM',
      type: type,
      yAxis: 1,
      yAxisOpposite: false,
      yAxisTitle: 'RPM',
      dashStyle: 'ShortDot'
    };
  }

  getActualRpmSeries() {
    let rpm = subscriptions.selectors.firstSubData(
      this.props.data, SUBSCRIPTIONS).getIn(['data', 'rpm']);
    return Object.assign(this.flowRateAxis, {
      data: List([
        Map({differential_pressure: 0.0, value: rpm}),
        Map({differential_pressure: this.actualDifferentialPressure, value: rpm})
      ]),
      title: 'Actual RPM',
      type: 'actual',
      dashStyle: 'Solid'
    });
  }

  getActualTorqueSeries() {
    return Object.assign(this.torqueAxis, {
      data: List([
        Map({differential_pressure: this.actualDifferentialPressure, value: this.actualTorque}),
        Map({differential_pressure: this.maxVisibleDifferentialPressure, value: this.actualTorque})
      ]),
      title: 'Actual Torque',
      type: 'actual'
    });
  }

  formatSeriesData(data, valueName, valueCategory, valueUnit) {
    data = this.props.convert.convertArray(data, 'differential_pressure', 'pressure', 'psi');
    data = this.props.convert.convertArray(data, valueName, valueCategory, valueUnit);
    data = data.map((datum) => {
      return Map({
        differential_pressure: datum.differential_pressure,
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
  coordinates: PropTypes.object.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OperatingConditionApp;
