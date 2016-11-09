import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import momentPropTypes from 'react-moment-proptypes';

import { load } from './actions';
import { isLoading, getData } from './selectors';
import Chart from '../../common/Chart';
import { Size } from '../constants';

import './TorqueAndDragBroomstickWidget.css'

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    this.props.dispatch(load(this.props.jobId, this.props.time));
  }

  render() {
    return (
      <div className="c-torque-and-drag-broomstick">
        {this.props.isLoading ?
            <p>Loading</p> :
            <Chart
              xField="depth"
              yField="load"
              data={this.props.data}
              isLegendVisible={this.isLegendVisible()}
              isAxisLabelsVisible={this.isAxisLabelsVisible()} />}
      </div>
    );
  }

  isLegendVisible() {
    return this.props.size !== Size.SMALL
  }

  isAxisLabelsVisible() {
    return this.props.size !== Size.SMALL
  }

}

TorqueAndDragBroomstickWidget.propTypes = {
  jobId: PropTypes.number.isRequired,
  time: momentPropTypes.momentObj.isRequired,
  size: PropTypes.string.isRequired
};

export default connect(
  createStructuredSelector({
    isLoading,
    data: getData
  })
)(TorqueAndDragBroomstickWidget);
