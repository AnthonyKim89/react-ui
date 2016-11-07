import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import momentPropTypes from 'react-moment-proptypes';

import { load } from './actions';
import { isLoading, getData } from './selectors';
import Chart from '../../common/Chart';

import './TorqueAndDragBroomstickWidget.css'

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    this.props.dispatch(load(this.props.jobId, this.props.time));
  }

  render() {
    return (
      <div className="torqueAndDragBroomstick">
        {this.props.isLoading ?
            <p>Loading</p> :
            <Chart
              xField="load"
              yField="depth"
              data={this.props.data} />}
      </div>
    );
  }

}

TorqueAndDragBroomstickWidget.propTypes = {
  jobId: PropTypes.number.isRequired,
  time: momentPropTypes.momentObj.isRequired
};

export default connect(
  createStructuredSelector({
    isLoading,
    data: getData
  })
)(TorqueAndDragBroomstickWidget);
