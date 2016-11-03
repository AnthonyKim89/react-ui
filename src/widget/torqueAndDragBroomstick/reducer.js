import { Map } from 'immutable';
import * as t from './actions';

const initialState = Map();

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        data: action.data
      });
    default:
      return state;
  }
};
