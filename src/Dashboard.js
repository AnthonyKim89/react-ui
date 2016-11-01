import React, { Component } from 'react';
import TabBar from './TabBar';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard" >
        <TabBar page={this.props.route.path} />
        {this.props.children}
      </div>
    );
  }
}

export default Dashboard;
