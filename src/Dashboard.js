import React, { Component } from 'react';
import TabBar from './TabBar';

import './Dashboard.css';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard" >
        {this.props.children}
        <TabBar page={this.props.route.path} />
      </div>
    );
  }
}

export default Dashboard;
