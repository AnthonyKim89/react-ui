import React, { Component } from 'react';
import moment from 'moment';
import WidgetContainer from './WidgetContainer';

import TorqueAndDragBroomstickWidget from './torque-and-drag-broomstick';

import './WidgetGrid.css';

class WidgetGrid extends Component {
  render() {
    const time = moment('2016-08-03');
    return (
      <div className="WidgetGrid">
        <WidgetContainer>
          <TorqueAndDragBroomstickWidget jobId={1029} time={time} />
        </WidgetContainer>
        <WidgetContainer />
        <WidgetContainer />
      </div>
    );
  }
}

export default WidgetGrid;
