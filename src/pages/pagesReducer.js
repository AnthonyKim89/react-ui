import { Map } from 'immutable';
import * as t from './actions';

const initialState = Map({
  isLoading: true,
  currentUser: null,
  widgetSets: Map()
});

function widgetsById(widgets) {
  return widgets.reduce(
    (res, w) => res.set(w.get('id'), w),
    Map()
  );
}

function widgetSetsById(widgetSets) {
  return widgetSets.reduce(
    (res, w) => res.set(w.get('id'), w.update('widgets', widgetsById)),
    Map()
  );
}

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
        widgetSets: widgetSetsById(widgetSets)
      });
    case t.MOVE_WIDGET:
      const {widgetSet, id, coordinates} = action;
      return state.setIn(
        ['widgetSets', widgetSet.get('id'), 'widgets', id, 'coordinates'],
        Map(coordinates)
      );
    default:
      return state;
  }
};
