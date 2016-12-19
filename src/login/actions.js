import { push } from 'react-router-redux';
import * as api from '../api';
import pages from '../pages';

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

export const LOG_IN = 'login/LOG_IN';
export function logIn(email, password) {
  return async dispatch => {
    try {
      await api.logIn(email, password);
      const user = await api.getCurrentUser();
      dispatch(loggedIn(user));
      dispatch(push('/'));
      dispatch(pages.actions.start());
    } catch (e) {
      if (e.isAuthenticationProblem()) {
        dispatch(loginFailed());
      } else {
        throw e;
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
  };
}

export function loginCheck() {
  return async dispatch => {
    try {
      const user = await api.getCurrentUser();
      dispatch(loggedIn(user));
      dispatch(pages.actions.start());
    } catch (e) {
      if (e.isAuthenticationProblem()) {
        dispatch(push('/login'));
      } else {
        throw e;
      }
    }
  };
}
