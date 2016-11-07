import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import moment from 'moment';
import { find } from 'lodash';

import WidgetContainer from './WidgetContainer';
import torqueAndDragBroomstick from './torqueAndDragBroomstick';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './WidgetGrid.css';

const GridLayout = WidthProvider(Responsive);

class WidgetGrid extends Component {
  render() {
    return (
      <div className="WidgetGrid">
        <GridLayout breakpoints={{large: 1024, medium: 512, small: 0}}
                    cols={{large: 8, medium: 4, small: 1}}
                    rowHeight={30}>
          {this.renderGridWidgets()}
        </GridLayout>
        {this.renderMaximizedWidget()}
      </div>
    );
  }

  renderGridWidgets() {
    const maximizedId = this.getMaximizedWidgetId();
    return this.getWidgets()
      .filter(widget => widget.id !== maximizedId)
      .map(({id, gridConfig, content}) =>
        <div key={id} data-grid={gridConfig}>
          <WidgetContainer id={id}>
            {content}
          </WidgetContainer>
        </div>
      );
  }

  renderMaximizedWidget() {
    const widget = this.getMaximizedWidget();
    if (widget) {
      return <div className="MaximizedWidget">
        {widget}
      </div>;
    } else {
      return null;
    }
  }

  getMaximizedWidgetId() {
    if (this.props.location.query.maximize) {
      return parseInt(this.props.location.query.maximize, 10);
    } else {
      return null;
    }
  }

  getMaximizedWidget() {
    if (this.getMaximizedWidgetId()) {
      const {id, content} = find(this.getWidgets(), {id: this.getMaximizedWidgetId()});
      return <WidgetContainer id={id} maximized={true}>
        {content}
      </WidgetContainer>
    } else {
      return null;
    }
  }

  // This data will come from a backend API in the future
  getWidgets() {
    const time = moment('2016-08-03');
    return [{
      id: 1,
      gridConfig: {x: 0, y: 0, w: 3, h: 12},
      content: <torqueAndDragBroomstick.Widget jobId={1029} time={time} />
    }, {
      id: 2,
      gridConfig: {x: 3, y: 0, w: 2, h: 4}
    }, {
      id: 3,
      gridConfig: {x: 3, y: 4, w: 2, h: 4}
    }, {
      id: 4,
      gridConfig: {x: 3, y: 8, w: 2, h: 4} 
    }, {
      id: 5,
      gridConfig: {x: 5, y: 0, w: 3, h: 5}
    }, {
      id: 6,
      gridConfig: {x: 5, y: 5, w: 1, h: 7}
    }, {
      id: 7,
      gridConfig: {x: 6, y: 5, w: 2, h: 7} 
    }]
  }
}

export default WidgetGrid;
