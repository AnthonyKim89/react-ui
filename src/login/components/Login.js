import { isEmpty } from 'lodash';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Input, Button } from 'react-materialize';

import { logIn } from '../actions';
import { loginFailure, loggingIn, apiFailure } from '../selectors';

import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  render() {
    return <div className="c-login"><div className="c-login-background-gradient"><div className="c-login-box">
      <h1 className="c-login__brand">Corva</h1>
      <div className="c-login__divider">Sign In with Email</div>
      <form className="c-login__form"
            onSubmit={e => this.doLogin(e)}>
        <Input type="email"
               name="email"
               value={this.state.email}
               label="Email"
               required
               onChange={e => this.setEmail(e)} />
        <Input type="password"
               name="password"
               value={this.state.password}
               label="Password"
               required
               onChange={e => this.setPassword(e)} />
        <Button type="submit" waves="light"
                disabled={!this.isLoginValid()}>Sign In</Button>
        {this.props.loggingIn && <div className="progress">
          <div className="indeterminate"></div>
        </div>}
        {this.props.loginFailure &&
          <div className="c-login__failure">Invalid Email and/or Password</div>}
        {this.props.apiFailure &&
          <div className="c-login__failure">Unable to Connect to API Server</div>}
      </form>
      <div className="c-login__divider"></div>
    </div></div></div>;
  }

  setEmail(evt) {
    this.setState({email: evt.target.value});
  }

  setPassword(evt) {
    this.setState({password: evt.target.value});
  }

  isLoginValid() {
    return !isEmpty(this.state.email) && !isEmpty(this.state.password);
  }

  doLogin(evt) {
    if (this.isLoginValid()) {
      this.props.logIn(this.state.email, this.state.password);
    }
    evt.preventDefault();
  }

}

export default connect(
  createStructuredSelector({
    loginFailure,
    loggingIn,
    apiFailure
  }),
  {logIn}
)(Login);
