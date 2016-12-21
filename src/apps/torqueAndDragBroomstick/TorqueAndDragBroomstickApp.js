import React, { Component, PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Chart from '../../common/Chart';
import ChartSeries from '../../common/ChartSeries';
import { Size } from '../constants';

import './TorqueAndDragBroomstickApp.css'

class TorqueAndDragBroomstickApp extends Component {

  render() {
    return (
      <div className="c-torque-and-drag-broomstick">
        {this.props.data ?
            <Chart
              xField="measured_depth"
              yField="hookload"
              isLegendVisible={this.isLegendVisible()}
              isAxisLabelsVisible={this.isAxisLabelsVisible()} >
              {this.getSeries().map(({renderType, title, type, data}, idx) => (
                <ChartSeries
                  key={idx}
                  type={renderType}
                  title={title}
                  data={data}
                  color={this.getSeriesColor(type)} />
              )).toJS()}
            </Chart> :
            <p>Loading</p>}
      </div>
    );
  }

  getSeries() {
    return this.getPredictedCurveSeries()
      .concat(this.getActualSeries());
  }

  getPredictedCurveSeries() {
    return this.props.data.getIn(['data', 'curves'])
      .entrySeq()
      .flatMap(([curveType, curves]) =>
        curves.map(curve => ({
          renderType: 'line',
          title: `${curveType} ${curve.get('casing_friction_factor')} ${curve.get('openhole_friction_factor')}`,
          type: curveType,
          data: curve.get('points')
        }))
      );
  }

  getActualSeries() {
    return this.props.data.getIn(['data', 'actual'])
      .entrySeq()
      .map(([curveType, points]) => ({
        renderType: 'scatter',
        title: curveType,
        type: curveType,
        data: points
      }));
  }

  getSeriesColor(seriesType) {
    switch(seriesType) {
      case 'rotary_off_bottom':
        return '#f7e47a';
      case 'pick_up':
        return '#78905f';
      case 'slack_off':
      default:
        return '#5f7f90';
    }
  }

  isLegendVisible() {
    return this.props.size === Size.XLARGE || this.props.size === Size.LARGE
  }

  isAxisLabelsVisible() {
    return this.props.size !== Size.SMALL
  }

}

TorqueAndDragBroomstickApp.propTypes = {
  data: ImmutablePropTypes.map,
  time: momentPropTypes.momentObj.isRequired,
  size: PropTypes.string.isRequired
};

export default TorqueAndDragBroomstickApp;
