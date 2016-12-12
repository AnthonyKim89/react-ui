import React, { Component, PropTypes } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Modal from 'react-modal';
import moment from 'moment';
import ImmutablePropTypes from 'react-immutable-proptypes';

import WidgetContainer from './WidgetContainer';
import { Size, GRID_BREAKPOINTS, GRID_COLUMN_SIZES, GRID_ROW_HEIGHT } from '../constants';
import widgetRegistry from '../widgetRegistry';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './WidgetGrid.css';

const GridLayout = WidthProvider(Responsive);

const addWidgetModalStyles = {
  content: {
    top: '20%',
    left: '20%',
    right: '20%',
    bottom: '20%',
    borderRadius: 0
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
};

class WidgetGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {addWidgetDialogOpen: false};
  }

  render() {
    const widgetProps = {
      time: this.props.wellDrillTime || moment('2016-08-31'),
      wellId: this.props.wellId // For well pages, id is given
    };
    return (
      <div className="c-widget-grid">
        <GridLayout breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLUMN_SIZES}
                    rowHeight={GRID_ROW_HEIGHT}
                    onResizeStop={(...args) => this.onResizeStop(...args)}
                    onDragStop={(...args) => this.onDragStop(...args)}>
          {this.renderGridWidgets(widgetProps)}
        </GridLayout>
        {this.renderMaximizedWidget(widgetProps)}
        <button onClick={() => this.openAddWidgetDialog()}>Add Widget</button>
        <Modal
          isOpen={this.state.addWidgetDialogOpen}
          onRequestClose={() => this.closeAddWidgetDialog()}
          style={addWidgetModalStyles}
          contentLabel="Example Modal">
          <h2>Add Widget to Dashboard</h2>
        </Modal>
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
                            subtitle={constants.SUBTITLE}
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

  onResizeStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onWidgetMove(parseInt(i, 10), {x, y, w, h});
  }

  onDragStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onWidgetMove(parseInt(i, 10), {x, y, w, h});
  }

  openAddWidgetDialog() {
    this.setState(() => ({addWidgetDialogOpen: true}));
  }

  closeAddWidgetDialog() {
    this.setState(() => ({addWidgetDialogOpen: false}));
  }

}

WidgetGrid.propTypes = {
  widgets: ImmutablePropTypes.seq.isRequired,
  onWidgetMove: PropTypes.func.isRequired,
  wellId: PropTypes.number,
  wellDrillTime: PropTypes.object,
  location: PropTypes.object,
};

export default WidgetGrid;
