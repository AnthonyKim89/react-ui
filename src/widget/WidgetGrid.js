import React, { Component } from 'react';
import moment from 'moment';
import WidgetContainer from './WidgetContainer';

import torqueAndDragBroomstick from './torqueAndDragBroomstick';

import './WidgetGrid.css';

class WidgetGrid extends Component {
  render() {
    const time = moment('2016-08-03');
    return (
      <div className="WidgetGrid">
        <WidgetContainer>
          <torqueAndDragBroomstick.Widget jobId={1029} time={time} />
        </WidgetContainer>
        <WidgetContainer />
        <WidgetContainer />
      </div>
    );
  }
}

export default WidgetGrid;
