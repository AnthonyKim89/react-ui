import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WidgetGrid from '../widgets/WidgetGrid';

import { currentDashboard } from './selectors';
import { moveWidget } from './actions';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <WidgetGrid widgets={this.props.currentDashboard.get('widgets').valueSeq()}
                      onWidgetMove={(...a) => this.onWidgetMove(...a)}
                      location={this.props.location} />}
      </div>
    );
  }

  onWidgetMove(id, newCoordinates) {
    this.props.moveWidget(this.props.currentDashboard, id, newCoordinates);
  }
}

export default connect(
  createStructuredSelector({
    currentDashboard
  }),
  {moveWidget}
)(Dashboard);
