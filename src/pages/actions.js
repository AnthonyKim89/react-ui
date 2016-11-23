import { getCurrentUser, getWidgetSets, updateWidget } from '../api';
import { push } from 'react-router-redux'
import { dashboards, currentUser, allWidgetSets } from './selectors';

export const START_LOAD = 'START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'FINISH_LOAD';
function finishLoad(data) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_LOAD, data});
    const dashboard = dashboards(getState()).first();
    const currentPath = getState().routing.locationBeforeTransitions.pathname;
    if (currentPath === '/') {
      dispatch(push(`/dashboards/${dashboard.get('id')}`));
    }
  };
}

export function start() {
  return async dispatch => {
    dispatch(startLoad());
    const user = await getCurrentUser();
    const widgetSets = await getWidgetSets(user.get('id'));
    dispatch(finishLoad({user, widgetSets}));
  };
}


export const MOVE_WIDGET = 'MOVE_WIDGET';
export function moveWidget(widgetSet, id, coordinates) {
  return (dispatch, getState) => {
    dispatch({type: MOVE_WIDGET, widgetSet, id, coordinates});
    const user = currentUser(getState());
    const widget = allWidgetSets(getState()).getIn([widgetSet.get('id'), 'widgets', id]);
    updateWidget(user.get('id'), widgetSet.get('id'), widget);
  };
}
