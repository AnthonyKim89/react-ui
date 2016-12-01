import { push } from 'react-router-redux';
import { getCurrentUser } from '../api';
import pages from '../pages';

export const LOGGED_IN = 'login/LOGGED_IN';
function loggedIn(user) {
  return {type: LOGGED_IN, user};
}


export function loginCheck() {
  return async dispatch => {
    try {
      const user = await getCurrentUser();
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
