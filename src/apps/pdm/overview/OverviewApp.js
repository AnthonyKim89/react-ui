import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col } from 'react-materialize';
import { fromJS } from 'immutable';
import numeral from 'numeral';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Gauge from '../../../common/Gauge';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './OverviewApp.css';

class OverviewApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates);
  }

  render() {
    return (
      <div className="c-pdm-overview">
        <div className="gaps"></div>
        {this.data ?
          <div>
            <Row className="c-pdm-overview__gauge-row">
              <Col m={6} s={12}>
                <h4 className="c-pdm-overview__gauge-title">Yield Efficiency</h4>
                <Gauge widthCols={this.props.widthCols}
                       bands={this.gaugeBands}
                       value={this.yieldEfficiencySeverity} />
              </Col>
              <Col m={6} s={12}>
                {this.renderStatistics()}
              </Col>
            </Row>
            <Row>
              <Col s={12} className="c-pdm-overview__torque">
                <h4 className="c-pdm-overview__torque-title">Torque</h4>
                <Chart
                  horizontal={true}
                  chartType="column"
                  xField="time"
                  size={this.props.size}
                  coordinates={this.props.coordinates}
                  widthCols={this.props.widthCols}
                  hideXAxis={true}
                  alignYTicks={false}
                  yTickPositioner={this.yTickPositioner}
                  showLegend={false}
                  gridLineWidth="0"
                  yLabelStyle={{
                    color: "#bbb",
                    "font-size": "0.55rem",
                  }}
                >
                  {this.getSeries().map(({field, maxValue, data}, idx) => (
                    <ChartSeries
                      key={field}
                      id={field}
                      title={SUPPORTED_CHART_SERIES[field].label}
                      data={data}
                      yField="value"
                      type="column"
                      pointPadding={0}
                      groupPadding={0}
                      borderWidth={0} />
                  ))}
                </Chart>
              </Col>
            </Row>
            <Row className="c-pdm-overview__torque-label">
              <Col s={6} className="c-pdm-overview__torque-label-left">
                24 hours ago
              </Col>
              <Col s={6} className="c-pdm-overview__torque-label-right">
                Now
              </Col>
            </Row>
          </div> :
        <LoadingIndicator/> }
      </div>
    );
  }

  get data() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  get gaugeBands() {
    return {
      red:    {from: 0,  to: 10},
      yellow: {from: 10, to: 20},
      green:  {from: 20, to: 30}
    };
  }

  get yieldEfficiencySeverity() {
    const severity = this.data.getIn(["data", "yield_efficiency", "severity"]);
    return this.getGaugeValue(severity);
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 5;
      case 'moderate': return 15;
      case 'high': return 25;
      default: return null;
    }
  }

  renderStatistics() {
    let recommendedDifferentialPressure = this.data.getIn(["data", "recommendations", "differential_pressure"]);
    recommendedDifferentialPressure = numeral(this.props.convert.convertValue(recommendedDifferentialPressure, "pressure", "psi")).format("0");
    let pressureUnit = `${this.props.convert.getUnitDisplay('pressure')}`;

    return (
      <div className="c-pdm-overview-statistics">
        <p>Recommended Differential Pressure</p>
        <div className="pressure">
          {recommendedDifferentialPressure} <span>{pressureUnit}</span>
        </div>
      </div>
    );
  }

  getSeries() {
    return Object.keys(SUPPORTED_CHART_SERIES)
      .map(s => this.getDataSeries(s));
  }

  getDataSeries(field) {
    let seriesData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'torque_output']);
    seriesData = this.updatePointColor(seriesData);

    return {
      field,
      maxValue: seriesData.maxValue,
      data: seriesData.series
    };
  }

  updatePointColor(seriesData) {
    let updatedSeries = [];
    let max = 0;
    seriesData.valueSeq().forEach((v) => {
      v = v.toJS();
      let color = null;
      switch (v["severity"]) {
        case "low":
          color = "rgb(132, 191, 85)";
          break;
        case "moderate":
          color = "rgb(234, 202, 69)";
          break;
        case "high":
          color = "rgb(255, 40, 79)";
          break;
        default:
          break;
      }

      max = Math.max(v["value"], max);

      if (color !== null) {
        v["color"] = color;
      }

      updatedSeries.push(v);
    });

    return {
      series: fromJS(updatedSeries),
      maxValue: max,
    };
  }

}

OverviewApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default OverviewApp;
