import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import momentPropTypes from 'react-moment-proptypes';

import { load } from './actions';
import { isLoading, getData } from './selectors';
import Chart from '../../common/Chart';
import ChartSeries from '../../common/ChartSeries';
import { Size } from '../constants';

import './TorqueAndDragBroomstickWidget.css'

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    this.props.dispatch(load(this.props.wellId, this.props.time));
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.time.isSame(this.props.time)) {
      this.props.dispatch(load(this.props.wellId, newProps.time));
    }
  }

  render() {
    return (
      <div className="c-torque-and-drag-broomstick">
        {this.props.isLoading ?
            <p>Loading</p> :
            <Chart
              xField="measured_depth"
              yField="hookload"
              isLegendVisible={this.isLegendVisible()}
              isAxisLabelsVisible={this.isAxisLabelsVisible()} >
              {this.props.data.get('series').map((series, idx) => (
                <ChartSeries
                  key={idx}
                  type={series.get('renderType')}
                  title={series.get('title')}
                  data={series.get('data')}
                  color={this.getSeriesColor(series.get('type'))} />
              )).toJS()}
            </Chart>}
      </div>
    );
  }

  getSeriesColor(seriesType) {
    switch(seriesType) {
      case 'rotating':
        return '#f7e47a';
      case 'pickup':
        return '#78905f';
      case 'slackoff':
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

TorqueAndDragBroomstickWidget.propTypes = {
  wellId: PropTypes.number.isRequired,
  time: momentPropTypes.momentObj.isRequired,
  size: PropTypes.string.isRequired
};

export default connect(
  createStructuredSelector({
    isLoading,
    data: getData
  })
)(TorqueAndDragBroomstickWidget);
