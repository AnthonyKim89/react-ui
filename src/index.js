import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { routes } from './routes';

import rootReducer from './rootReducer';
import authMiddleware from './login/authMiddleware';


import 'materialize-css/bin/jquery-2.1.1.min';
import 'materialize-css/bin/materialize';

// import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './fonts.css';
import 'materialize-css/bin/materialize.css';
import './index.css';

const store = createStore(rootReducer, applyMiddleware(
  authMiddleware,
  thunk,
  routerMiddleware(browserHistory)
));
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);