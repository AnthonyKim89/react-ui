import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { routes } from './routes';

import rootReducer from './rootReducer';
import authMiddleware from './login/authMiddleware';

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

// Programmatic navigation utility for native apps
window.navigateAppTo = path => {
  store.dispatch(push(path));
};