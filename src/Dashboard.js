import React, { Component } from 'react';
import WidgetGrid from './widgets/WidgetGrid';

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        <WidgetGrid {...this.props} />
      </div>
    );
  }
}

export default Dashboard;
