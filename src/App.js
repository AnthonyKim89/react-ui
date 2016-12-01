import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import MainNav from './MainNav';

import login from './login';
import pages from './pages';

class App extends Component {

  componentDidMount() {
    this.props.loginCheck();
  }

  render() {
    return (
      <div>
        {this.props.currentUser &&
          <MainNav currentUser={this.props.currentUser}
                   dashboards={this.props.dashboards}
                   logOut={this.props.logOut} />}
        {this.props.children}
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
    currentUser: login.selectors.currentUser,
    dashboards: pages.selectors.dashboards
  }),
  {
    loginCheck: login.actions.loginCheck,
    logOut: login.actions.logOut
  }
)(App);
