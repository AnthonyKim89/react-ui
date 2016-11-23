import { List, Map } from 'immutable';
import * as t from './actions';

const initialState = Map({
  isLoading: true,
  currentUser: null,
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
      const {user, widgetSets} = action.data;
      return state.merge({
        isLoading: false,
        currentUser: user,
        dashboards: widgetSets.filter(ws => ws.get('type') === 'dashboard'),
        wellPages: widgetSets.filter(ws => ws.get('type') === 'well_page')
      });
    default:
      return state;
  }
};
