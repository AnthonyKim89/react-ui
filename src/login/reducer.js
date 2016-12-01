import { Map } from 'immutable';
import * as actions from './actions';

const initialState = Map({
  currentUser: null,
  loginFailure: false
});

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGGED_IN:
      return state.merge({
        currentUser: action.user,
        loginFailure: false
      });
    case actions.LOGIN_FAILED:
      return state.merge({
        loginFailure: true
      });
    default: return state;
  }
}