import { Map } from 'immutable';
import * as actions from './actions';

const initialState = Map({
  currentUser: null
});

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGGED_IN:
      return state.merge({currentUser: action.user});
    default: return state;
  }
}