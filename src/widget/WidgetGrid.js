import React, { Component } from 'react';
import WidgetContainer from './WidgetContainer';

import TorqueAndDragBroomstickWidget from './torque-and-drag-broomstick';

import './WidgetGrid.css';

class WidgetGrid extends Component {
  render() {
    return (
      <div className="WidgetGrid">
        <WidgetContainer>
          <TorqueAndDragBroomstickWidget />
        </WidgetContainer>
        <WidgetContainer />
        <WidgetContainer />
      </div>
    );
  }
}

export default WidgetGrid;
