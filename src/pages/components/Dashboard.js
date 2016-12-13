import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AppGrid from '../../apps/components/AppGrid';

import { currentDashboard } from '../selectors';
import { moveApp, addApp } from '../actions';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <AppGrid apps={this.props.currentDashboard.get('apps').valueSeq()}
                   onAppMove={(...a) => this.onAppMove(...a)}
                   onAppAdd={(...a) => this.onAppAdd(...a)}
                   location={this.props.location} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentDashboard, id, newCoordinates);
  }

  onAppAdd(appType) {
    this.props.addApp(this.props.currentDashboard, appType);
  }

}

export default connect(
  createStructuredSelector({
    currentDashboard
  }),
  {moveApp, addApp}
)(Dashboard);
