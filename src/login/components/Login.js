import React, {Component} from 'react';

import './Login.css';

class Login extends Component {

  render() {
    return <div className="c-login">
      <h1 className="c-login__brand">Corva</h1>
      <div className="c-login__divider"><span>Sign In with Email</span></div>
      <div className="c-login__form">
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
      </div>
      <button>Sign In</button>
      <div className="c-login__divider"></div>
    </div>;
  }

}

export default Login;