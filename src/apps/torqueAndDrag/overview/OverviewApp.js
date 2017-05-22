import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS } from 'immutable';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import Gauge from '../../../common/Gauge';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './OverviewApp.css';

class OverviewApp extends Component {

  render() {
    return (
      <div className="c-tnd-overview">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
            <div>
              <Row>
                <Col s={6} className="c-tnd-overview__gauge">
                  <h4 className="c-tnd-overview__gauge-title">Weight Transfer</h4>
                  <Gauge widthCols={this.props.widthCols}
                         bands={this.getGaugeBands()}
                         value={this.getWeightTransferGaugeValue()} />
                </Col>
                <Col s={6} className="c-tnd-overview__gauge">
                  <h4 className="c-tnd-overview__gauge-title">Drag</h4>
                  <Gauge widthCols={this.props.widthCols}
                         bands={this.getGaugeBands()}
                         value={this.getDragGaugeValue()} />
                </Col>
              </Row>
              <Row>
                <Col s={12} className="c-tnd-overview__drag">
                  <h4 className="c-tnd-overview__drag-title">Drag Trend</h4>
                  <Chart horizontal={true}
                         chartType="column"
                         xField="time"
                         automaticOrientation={false}
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
                         }}>
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
              <Row className="c-tnd-overview__drag-label-">
                <Col s={6} className="c-tnd-overview__drag-label-left">
                  24 hours ago
                </Col>
                <Col s={6} className="c-tnd-overview__drag-label-right">
                  Now
                </Col>
              </Row>
            </div>:
          <LoadingIndicator />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates))
    );
  }

  yTickPositioner () {
    return [0, 10, this.dataMax+5];
  }

  getSeries() {
    return Object.keys(SUPPORTED_CHART_SERIES)
      .map(s => this.getDataSeries(s));
  }

  getDataSeries(field) {
    let seriesData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'drag', 'points']);
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

  getGaugeBands() {
    return {
      red:    {from: 0,  to: 10},
      yellow: {from: 10, to: 20},
      green:  {from: 20, to: 30}
    };
  }

  getWeightTransferGaugeValue() {
    return this.getGaugeValue(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'weight_transfer']));
  }

  getDragGaugeValue() {
    return this.getGaugeValueForDrag(subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', 'drag', 'severity']));
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 5;
      case 'moderate': return 15;
      case 'high': return 25;
      default: return null;
    }
  }

  getGaugeValueForDrag(severity) {
    switch (severity) {
      case 'low': return 25;
      case 'moderate': return 15;
      case 'high': return 5;
      default: return null;
    }
  }
}

OverviewApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OverviewApp;
