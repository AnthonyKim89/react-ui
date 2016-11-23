import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MainNav from './MainNav';

import { start } from './pages/actions';
import { dashboards } from './pages/selectors';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(start());
  }

  render() {
    return (
      <div>
        <MainNav dashboards={this.props.dashboards} />
        {this.props.children}
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
    dashboards
  })
)(App);
