import { isEmpty } from 'lodash';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Input, Button } from 'react-materialize';

import { logIn } from '../actions';
import { loginFailure } from '../selectors';

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
      {this.props.loginFailure &&
        <div className="c-login__failure">Invalid email and/or password</div>}
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
    loginFailure
  }),
  {logIn}
)(Login);
