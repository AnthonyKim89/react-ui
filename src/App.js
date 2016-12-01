import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MainNav from './MainNav';

import login from './login';
import pages from './pages';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(login.actions.loginCheck());
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
    dashboards: pages.selectors.dashboards
  })
)(App);
