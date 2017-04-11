import { push } from 'react-router-redux';
import queryString from 'query-string';
import * as api from '../api';
import * as auth from '../auth';
import pages from '../pages';
import subscriptions from '../subscriptions';

export const LOG_IN = 'login/LOG_IN';
function loggingIn() {
  return {type: LOG_IN};
}

export const LOGGED_IN = 'login/LOGGED_IN';
function loggedIn(user) {
  return {type: LOGGED_IN, user};
}

export const LOGGED_OUT = 'login/LOGGED_OUT';
function loggedOut() {
  return {type: LOGGED_OUT};
}

export const LOGIN_FAILED = 'login/LOGIN_FAILED';
function loginFailed() {
  return {type: LOGIN_FAILED};
}

export const API_FAILURE = 'login/API_FAILURE';
function loginAPIFailure() {
  return {type: API_FAILURE};
}

export function logIn(email, password) {
  return async dispatch => {
    dispatch(loggingIn());
    try {
      await api.logIn(email, password);
      const user = await api.getCurrentUser();
      dispatch(loggedIn(user));
      dispatch(push('/'));
      dispatch(pages.actions.start(false));
    } catch (e) {
      if (e.isAuthenticationProblem()) {
        dispatch(loginFailed());
      } else {
        dispatch(loginAPIFailure());
      }
    }
  };
}

export const LOG_OUT = 'login/LOG_OUT';
export function logOut() {
  return async dispatch => {
    await api.logOut();
    dispatch(loggedOut());
    dispatch(push('/login'));
    subscriptions.actions.disconnect();
  };
}

export function loginCheck() {
  return async dispatch => {
    const qry = queryString.parse(location.search);
    if (qry.jwt) {
      auth.setToken(qry.jwt);
    }
    try {
      const user = await api.getCurrentUser();
      dispatch(loggedIn(user));
      dispatch(pages.actions.start(!!qry.native));
    } catch (e) {
      dispatch(push('/login'));
      // If it IS an authentication problem, then they just need to log in.
      if (!e.isAuthenticationProblem()) {
        // otherwise display API error on the login page.
        dispatch(loginAPIFailure());
      }
    }
  };
}
