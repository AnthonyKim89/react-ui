import React, { Component } from 'react';

import './TorqueAndDragBroomstickWidget.css'
import { getTorque } from '../../api';

class TorqueAndDragBroomstickWidget extends Component {

  componentDidMount() {
    getTorque({
      jobId: 1029,
      date: '1470237390',
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

export default TorqueAndDragBroomstickWidget;