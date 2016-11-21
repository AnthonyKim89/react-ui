import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import MainNav from './MainNav';
import { start } from './widgets/actions';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(start());
  }

  render() {
    return (
      <div>
        <MainNav />
        {this.props.children}
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
  })
)(App);
