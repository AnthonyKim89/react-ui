import React, { Component, PropTypes } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';

import WidgetContainer from './WidgetContainer';
import { Size, GRID_BREAKPOINTS, GRID_COLUMN_SIZES, GRID_ROW_HEIGHT } from './constants';
import widgetRegistry from './widgetRegistry';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './WidgetGrid.css';

const GridLayout = WidthProvider(Responsive);

class WidgetGrid extends Component {

  render() {
    const widgetProps = {
      time: moment('2016-08-31'),
      wellId: this.props.wellId // For well pages, id is given
    };
    return (
      <div className="c-widget-grid">
        <GridLayout breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLUMN_SIZES}
                    rowHeight={GRID_ROW_HEIGHT}
                    onResizeStop={(...args) => this.onResizeStop(...args)}>
          {this.renderGridWidgets(widgetProps)}
        </GridLayout>
        {this.renderMaximizedWidget(widgetProps)}
      </div>
    );
  }

  renderGridWidgets(widgetProps) {
    const maximizedId = this.getMaximizedWidgetId();
    return this.props.widgets
      .filter(widget => widget.get('id') !== maximizedId)
      .map(widget => {
        const id = widget.get('id');
        const coordinates = widget.get('coordinates');
        return <div key={id} data-grid={coordinates.toJS()}>
          {this.renderWidget(widget, widgetProps)}
        </div>
      });
  }

  renderMaximizedWidget(widgetProps) {
    const id = this.getMaximizedWidgetId();
    if (id) {
      const widget = this.props.widgets.find(w => w.get('id') === id);
      return this.renderWidget(widget, widgetProps, true);
    } else {
      return null;
    }
  }

  renderWidget(widget, widgetProps, maximized = false) {
    const type = widget.get('type');
    const id = widget.get('id');
    const coordinates = widget.get('coordinates');
    const settings = widget.get('settings');
    const {constants, Widget} = widgetRegistry.get(type);
    return <WidgetContainer id={id}
                            title={constants.TITLE}
                            maximized={maximized}
                            location={this.props.location}>
      <Widget {...widgetProps}
              {...settings.toJS()}
              size={this.getWidgetSize(coordinates, maximized)} />
    </WidgetContainer>
  }

  getWidgetSize(gridConfig, maximized) {
    if (maximized) {
      return Size.XLARGE;
    } else if (gridConfig.get('w') >= 5) {
      return Size.LARGE;
    } else if (gridConfig.get('w') >= 3) {
      return Size.MEDIUM;
    } else {
      return Size.SMALL;
    }
  }

  getMaximizedWidgetId() {
    const id = this.props.location.query.maximize;
    return id && parseInt(id, 10);
  }

  onResizeStop(layout, oldItem, {i, w, h}) {
    this.setState(state => {
      const widgetIndex = state.widgets.findIndex(w => w.id === i);
      const widget = state.widgets.get(widgetIndex);
      const gridConfig = {...widget.gridConfig, w, h};
      return {
        widgets: state.widgets.set(widgetIndex, {...widget, gridConfig})
      }
    });
  }

}

WidgetGrid.propTypes = {
  widgets: ImmutablePropTypes.list.isRequired,
  wellId: PropTypes.number,
  location: PropTypes.object
};

export default WidgetGrid;
