import { Map } from 'immutable';
import * as actions from './actions';

const initialState = Map({
  currentUser: null,
  loginFailure: false,
  loggingIn: false,
  apiFailure: false,
});

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOG_IN:
      return state.merge({
        loggingIn: true,
        loginFailure: false,
        apiFailure: false,
      });
    case actions.LOGGED_IN:
      return state.merge({
        loggingIn: false,
        currentUser: action.user,
        loginFailure: false,
        apiFailure: false,
      });
    case actions.LOGGED_OUT:
      return state.merge({
        loggingIn: false,
        currentUser: null,
        apiFailure: false,
      });
    case actions.LOGIN_FAILED:
      return state.merge({
        loggingIn: false,
        loginFailure: true,
        apiFailure: false,
      });
    case actions.API_FAILURE:
      return state.merge({
        loggingIn: false,
        loginFailure: false,
        apiFailure: true,
      });
    default: return state;
  }
}