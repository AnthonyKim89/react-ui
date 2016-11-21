import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { routes } from './routes';

import rootReducer from './rootReducer';

import './index.css';

const store = createStore(rootReducer, applyMiddleware(
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
