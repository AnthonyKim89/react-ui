import React, { Component, PropTypes } from 'react';
import { Map, List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './PressureTrendApp.css';

class PressureTrendApp extends Component {

  constructor(props) {
    super(props);
    this.state = {series: List()};
  }

  render() {
    return (
      <div className="c-hydraulics-pressure-trend">
        {this.getData() ?
          <Chart
            xField="measured_depth"
            xAxisTitle={{text:`Measured Depth (${this.props.convert.getUnitDisplay('length')})`, style: { color: "#fff" }}}
            xAxisWidth="2"
            xAxisColor="white"
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

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }


  getSeries() {
    return List([this.getMudWeightSeries(), this.getECDSeries(), this.getStandpipePressureSeries()]);
  }

  getMudWeightSeries() {
    const type = 'mudWeight';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: 0,
        yAxisOpposite: false,
        yAxisTitle: `Mud Weight (${this.props.convert.getUnitDisplay('volume')}pm)`,
        data: List(this.getSeriesData('mud_weight', 'volume', 'gal'))
    };
  }

  getECDSeries() {
    const type = 'equivalentCirculatingDensity';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: 0,
        yAxisOpposite: false,
        yAxisTitle: `Mud Weight (${this.props.convert.getUnitDisplay('volume')}pm)`,
        data: List(this.getSeriesData('equivalent_circulating_density', 'volume', 'gal'))
    };
  }

  getStandpipePressureSeries() {
    const type = 'standpipePressure';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: 1,
        yAxisOpposite: true,
        yAxisTitle: `Pressure (${this.props.convert.getUnitDisplay('pressure')})`,
        data: List(this.getSeriesData('standpipe_pressure', 'pressure', 'psi'))
    };
  }

  getSeriesData(serieName, valueCategory, valueUnit) {
    let data = subscriptions.selectors.firstSubData(
        this.props.data, SUBSCRIPTIONS).getIn(['data', serieName]).toJSON();
    data = this.props.convert.convertImmutables(data, 'measured_depth', 'length', 'ft');
    data = this.props.convert.convertImmutables(data, 'value', valueCategory, valueUnit);
    data = data.map((datum) => {
      return Map(datum);
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

PressureTrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureTrendApp;
