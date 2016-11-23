import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WidgetGrid from './widgets/WidgetGrid';
import { dashboard } from './pages/selectors';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.dashboard &&
          <WidgetGrid widgets={this.props.dashboard.get('widgets')}
                      location={this.props.location} />}
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    dashboard
  })
)(Dashboard);
