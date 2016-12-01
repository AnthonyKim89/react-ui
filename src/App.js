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
        {this.props.currentUser &&
          <MainNav dashboards={this.props.dashboards} />}
        {this.props.children}
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
    currentUser: login.selectors.currentUser,
    dashboards: pages.selectors.dashboards
  })
)(App);
