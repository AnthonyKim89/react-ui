import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col } from 'react-materialize';
import numeral from 'numeral';

import { SUBSCRIPTIONS } from './constants';
import Gauge from '../../../common/Gauge';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

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
          <Row>
            <Col m={6} s={12}>
              <h4 className="c-pdm-overview__gauge-title">Yield Efficiency</h4>
              <Gauge widthCols={this.props.widthCols}
                     bands={this.gaugeBands}
                     value={this.holeCleaningSeverity} />
            </Col>
            <Col m={6} s={12}>
              {this.renderStatistics()}
            </Col>

            <Col s={12}>
              <div className="c-pdm-overview-progress">
                <div className="c-pdm-overview-progress-label">
                  <div className="pull-left">24 hrs ago</div>
                  <div className="pull-right">Now</div>
                </div>
                <div className="clearfix">
                  {this.renderProgress()}
                </div>
              </div>
            </Col>
          </Row> :
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

  get holeCleaningSeverity() {
    const severity = this.data.getIn(["data", "hole_cleaning", "severity"]);
    return this.getGaugeValue(severity);
  }

  getGaugeValue(severity) {
    switch (severity) {
      case 'low': return 25;
      case 'moderate': return 15;
      case 'high': return 5;
      default: return null;
    }
  }

  renderStatistics() {
    let recommendedFlowRate = this.data.getIn(["data", "static_hole_cleaning", "recommended_minimum_flowrate"]);
    recommendedFlowRate = this.props.convert.convertValue(recommendedFlowRate, "volume", "gal").fixFloat(1);
    let pressureUnit = `${this.props.convert.getUnitDisplay('pressure')}`;

    return (
      <div className="c-pdm-overview-statistics">
        <p>Recommended Differential Pressure</p>
        <div className="pressure">
          {recommendedFlowRate} <span>{pressureUnit}</span>
        </div>
      </div>
    );
  }

  renderProgress() {
    let pointsData = this.data.getIn(["data", "hole_cleaning", "points"]);
    let itemWidth = 100 / pointsData.size - 1;
    let style = {
      marginRight: "1%",
      width: itemWidth + "%"
    };

    return pointsData.map( (t,index) => {
      return (
        <div key={index} className="overview-progress-item" style={Object.assign({}, style, this.getColorStyle(t))}>
        </div>
      );
    });

  }

  getColorStyle(point) {
    let severity = point.get("severity");
    switch (severity) {
      case 'low': return {backgroundColor: "#00ff00"};
      case 'moderate': return {backgroundColor: "#ffff00"};
      case 'high': return {backgroundColor: "#ff0000"};
      default: return {backgroundColor: "#00ff00"};
    }
  }

}

OverviewApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default OverviewApp;
