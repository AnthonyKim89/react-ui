import { getCurrentUser } from '../api';
import pages from '../pages';

export const LOGGED_IN = 'login/LOGGED_IN';
function loggedIn(user) {
  return {type: LOGGED_IN, user};
}


export function loginCheck() {
  return async dispatch => {
    const user = await getCurrentUser();
    dispatch(loggedIn(user));
    dispatch(pages.actions.start());
  };
}
