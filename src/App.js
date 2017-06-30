import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import classSet from 'react-classset';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MainNav from './MainNav';
import LoadingIndicator from './common/LoadingIndicator';

import login from './login';
import pages from './pages';
import assets from './assets';

import './App.css';

injectTapEventPlugin();

class App extends Component {

  async componentDidMount() {
    this.props.loginCheck();
  }

  render() {
    const classes = {
      'c-app': true,
      'c-app--native': this.props.isNative
    };
    return (
      <div className={classSet(classes)}>
        {this.props.currentUser && !this.props.isNative &&
          <MainNav currentUser={this.props.currentUser}
                   dashboards={this.props.dashboards}
                   logOut={this.props.logOut} />}
        {this.props.isLoading ?
          <LoadingIndicator /> :
          this.props.children
        }
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
    currentUser: login.selectors.currentUser,
    isNative: pages.selectors.isNative,
    isLoading: pages.selectors.isLoading,
    dashboards: pages.selectors.dashboards,
  }),
  {
    loginCheck: login.actions.loginCheck,
    logOut: login.actions.logOut,
    listAssets: assets.actions.listAssets,
  }
)(App);
