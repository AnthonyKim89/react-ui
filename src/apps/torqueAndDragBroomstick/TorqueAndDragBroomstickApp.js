import React, { Component, PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {DEFAULT_GRAPH_COLORS} from './constants';
import Chart from '../../common/Chart';
import ChartSeries from '../../common/ChartSeries';

import './TorqueAndDragBroomstickApp.css'

class TorqueAndDragBroomstickApp extends Component {

  render() {
    return (
      <div className="c-torque-and-drag-broomstick">
        {this.props.data ?
          <Chart
            xField="measured_depth"
            yField="hookload"
            size={this.props.size}
            widthCols={this.props.widthCols}>
            {this.getSeries().map(({renderType, title, type, data}, idx) => (
              <ChartSeries
                key={title}
                id={title}
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
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return DEFAULT_GRAPH_COLORS[seriesType];
    }
  }

}

TorqueAndDragBroomstickApp.propTypes = {
  data: ImmutablePropTypes.map,
  time: momentPropTypes.momentObj,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default TorqueAndDragBroomstickApp;
