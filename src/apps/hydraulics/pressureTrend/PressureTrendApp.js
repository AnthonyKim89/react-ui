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
            coordinates={this.props.coordinates}
            xAxisWidth="2"
            xAxisColor="white"
            multiAxis={true}
            legendAlign='center'
            legendVerticalAlign='bottom'
            legendLayout='horizontal'
            showLegend={true}
            forceLegend={true}
            size={this.props.size}
            widthCols={this.props.widthCols}
            automaticOrientation={this.automaticOrientation}
            horizontal={this.horizontal}
            >
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
    return (
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors)) ||
        (nextProps.orientation !== this.props.orientation)
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }


  getSeries() {
    return List([this.getMudWeightSeries(), this.getECDSeries(), this.getStandpipePressureSeries(), this.getMudFlowInSeries()]);
  }

  getMudWeightSeries() {
    const type = 'mudWeight';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: '0',
        yField: "mud_weight",
        yAxisOpposite: false,
        yAxisTitle: `Mud Weight (${this.props.convert.getUnitDisplay('density')})`,
        data: List(this.getSeriesData('mud_weight', 'density', 'ppg'))
    };
  }

  getMudFlowInSeries() {
    const type = 'mudFlowIn';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: '2',
        yField: "mud_flow_in",
        yAxisOpposite: true,
        yAxisTitle: `Mud Flow In (${this.props.convert.getUnitDisplay('volume')}pm)`,
        data: List(this.getSeriesData('mud_flow_in', 'volume', 'gal'))
    };
  }

  getECDSeries() {
    const type = 'equivalentCirculatingDensity';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: '0',
        yField: "ecd",
        yAxisOpposite: false,
        yAxisTitle: `Mud Weight (${this.props.convert.getUnitDisplay('density')})`,
        data: List(this.getSeriesData('ecd', 'density', 'ppg'))
    };
  }

  getStandpipePressureSeries() {
    const type = 'standpipePressure';
    return {
        renderType: `${SUPPORTED_CHART_SERIES[type].type}`,
        title: `${SUPPORTED_CHART_SERIES[type].label}`,
        type: type,
        yAxis: '1',
        yField: "standpipe_pressure",
        yAxisOpposite: true,
        yAxisTitle: `Pressure (${this.props.convert.getUnitDisplay('pressure')})`,
        data: List(this.getSeriesData('standpipe_pressure', 'pressure', 'psi'))
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

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }

  get automaticOrientation() {
    return this.props.orientation && this.props.orientation === 'auto';
  }

  get horizontal() {
    if (this.props.orientation) {
      return this.props.orientation === 'horizontal';
    }
    return true;
  }

}

PressureTrendApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureTrendApp;
