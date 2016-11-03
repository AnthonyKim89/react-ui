import React, { Component, PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';

import './TorqueAndDragBroomstickWidget.css'
import { getTorque } from '../../api';

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    getTorque({
      jobId: this.props.jobId,
      date: this.props.time,
      zoom: 120,
      uuid: 2,
      interval: 60,
      step: 12
    }).then(torque => {
      console.log(torque.toJS());
    })
  }

  render() {
    return (
      <div className="torque-and-drag-broomstick">
        <h3>Broomstick</h3>
      </div>
    );
  }

}

TorqueAndDragBroomstickWidget.propTypes = {
  jobId: PropTypes.number.isRequired,
  time: momentPropTypes.momentObj.isRequired
};

export default TorqueAndDragBroomstickWidget;