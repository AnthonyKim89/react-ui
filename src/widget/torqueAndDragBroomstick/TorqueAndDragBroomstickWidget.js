import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { load } from './actions';
import { isLoading } from './selectors';
import momentPropTypes from 'react-moment-proptypes';

import './TorqueAndDragBroomstickWidget.css'

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    this.props.dispatch(load(this.props.jobId, this.props.time));
  }

  render() {
    return (
      <div className="torque-and-drag-broomstick">
        <h3>Broomstick</h3>
        {this.props.isLoading && <p>Loading</p>}
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
    isLoading
  })
)(TorqueAndDragBroomstickWidget);
