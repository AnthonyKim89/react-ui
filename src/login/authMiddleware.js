import { push } from 'react-router-redux';

/*
 * For any action creator that returns a Promise (which is usually a server call),
 * this middleware will add a rejection handler to that promise. If it is rejected
 * with an authentication problem, we will route to the login page.
 */
export default store => next => action => {
  const result = next(action);
  if (isPromise(result)) {
    return result.catch(e => {
      if (e.isAuthenticationProblem && e.isAuthenticationProblem()) {
        store.dispatch(push('/login'));
      }
      return Promise.reject(e);
    });
  } else {
    return result;
  }
};


function isPromise(o) {
  return Promise.resolve(o) === o;
}