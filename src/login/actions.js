import { push } from 'react-router-redux';
import * as api from '../api';
import pages from '../pages';

export const LOGIN_FAILED = 'login/LOGIN_FAILED';
function loginFailed() {
  return {type: LOGIN_FAILED};
}

export const LOG_IN = 'login/LOG_IN';
export function logIn(email, password) {
  return async dispatch => {
    try {
      const user = await api.logIn(email, password);
      dispatch(loggedIn(user));
      dispatch(push('/'));
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

export const LOGGED_IN = 'login/LOGGED_IN';
function loggedIn(user) {
  return {type: LOGGED_IN, user};
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
