import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import moment from 'moment';
import WidgetContainer from './WidgetContainer';

import torqueAndDragBroomstick from './torqueAndDragBroomstick';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './WidgetGrid.css';

const GridLayout = WidthProvider(Responsive);

class WidgetGrid extends Component {
  render() {
    const time = moment('2016-08-03');
    return (
      <GridLayout className="WidgetGrid"
                  breakpoints={{large: 1024, medium: 512, small: 0}}
                  cols={{large: 8, medium: 4, small: 1}}
                  rowHeight={30}>
        <div key={1} data-grid={{x: 0, y: 0, w: 3, h: 12}}>
          <WidgetContainer>
            <torqueAndDragBroomstick.Widget jobId={1029} time={time} />
          </WidgetContainer>
        </div>
        <div key={2} data-grid={{x: 3, y: 0, w: 2, h: 4}}>
          <WidgetContainer />
        </div>
        <div key={3} data-grid={{x: 3, y: 4, w: 2, h: 4}}>
          <WidgetContainer />
        </div>
        <div key={4} data-grid={{x: 3, y: 8, w: 2, h: 4}}>
          <WidgetContainer />
        </div>
        <div key={5} data-grid={{x: 5, y: 0, w: 3, h: 5}}>
          <WidgetContainer />
        </div>
        <div key={6} data-grid={{x: 5, y: 5, w: 1, h: 7}}>
          <WidgetContainer />
        </div>
        <div key={7} data-grid={{x: 6, y: 5, w: 2, h: 7}}>
          <WidgetContainer />
        </div>
      </GridLayout>
    );
  }
}

export default WidgetGrid;
