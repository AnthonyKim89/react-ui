import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, push } from 'react-router-redux'
import { Provider } from 'react-redux';
import { routes } from './routes';
import { store } from './store';
require('dotenv').config();

import 'materialize-css/bin/jquery-2.1.1.min';
import 'materialize-css/bin/materialize';

import 'font-awesome/css/font-awesome.css';
import './fonts.css';
import 'materialize-css/bin/materialize.css';
import './index.css';


const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

// Programmatic navigation utility for native apps
window.navigateAppTo = path => {
  store.dispatch(push(path));
};