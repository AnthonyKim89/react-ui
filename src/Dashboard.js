import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WidgetGrid from './widgets/WidgetGrid';
import { currentDashboard } from './pages/selectors';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <WidgetGrid widgets={this.props.currentDashboard.get('widgets')}
                      location={this.props.location} />}
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    currentDashboard
  })
)(Dashboard);
