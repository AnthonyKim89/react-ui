import { isEmpty } from 'lodash';
import React, {Component} from 'react';
import { connect } from 'react-redux';

import { logIn } from '../actions';

import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  render() {
    return <div className="c-login">
      <h1 className="c-login__brand">Corva</h1>
      <div className="c-login__divider"><span>Sign In with Email</span></div>
      <form className="c-login__form"
            onSubmit={e => this.doLogin(e)}>
        <input type="email"
               name="email"
               value={this.state.email}
               placeholder="Email"
               required
               onChange={e => this.setEmail(e)} />
        <input type="password"
               name="password"
               value={this.state.password}
               placeholder="Password"
               required
               onChange={e => this.setPassword(e)} />
        <button type="submit"
                disabled={!this.isLoginValid()}>Sign In</button>
      </form>
      <div className="c-login__divider"></div>
    </div>;
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
  () => ({}),
  {logIn}
)(Login);
