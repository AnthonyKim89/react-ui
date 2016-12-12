import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WidgetGrid from '../../widgets/components/WidgetGrid';

import { currentDashboard } from '../selectors';
import { moveWidget, addWidget } from '../actions';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <WidgetGrid widgets={this.props.currentDashboard.get('widgets').valueSeq()}
                      onWidgetMove={(...a) => this.onWidgetMove(...a)}
                      onWidgetAdd={(...a) => this.onWidgetAdd(...a)}
                      location={this.props.location} />}
      </div>
    );
  }

  onWidgetMove(id, newCoordinates) {
    this.props.moveWidget(this.props.currentDashboard, id, newCoordinates);
  }

  onWidgetAdd(widgetType) {
    this.props.addWidget(this.props.currentDashboard, widgetType);
  }

}

export default connect(
  createStructuredSelector({
    currentDashboard
  }),
  {moveWidget, addWidget}
)(Dashboard);
