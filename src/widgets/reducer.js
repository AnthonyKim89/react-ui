import { List, Map } from 'immutable';
import * as t from './actions';

const initialState = Map({
  isLoading: true,
  dashboards: List(),
  wellPages: List()
});

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        dashboards: action.data.filter(ws => ws.get('type') === 'dashboard'),
        wellPages: action.data.filter(ws => ws.get('type') === 'well_page')
      });
    default:
      return state;
  }
};
