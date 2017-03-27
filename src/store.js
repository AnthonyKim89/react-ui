import { browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';
import authMiddleware from './login/authMiddleware';

export const store = createStore(rootReducer, applyMiddleware(
  authMiddleware,
  thunk,
  routerMiddleware(browserHistory)
));