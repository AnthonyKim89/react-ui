import * as api from '../api';
import { push } from 'react-router-redux'
import { dashboards, allWidgetSets } from './selectors';
import login from '../login';

export const START_LOAD = 'START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'FINISH_LOAD';
function finishLoad(widgetSets) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_LOAD, widgetSets});
    const dashboard = dashboards(getState()).first();
    const currentPath = getState().routing.locationBeforeTransitions.pathname;
    if (currentPath === '/') {
      dispatch(push(`/dashboards/${dashboard.get('id')}`));
    }
  };
}

export function start() {
  return async (dispatch, getState) => {
    dispatch(startLoad());
    const user = login.selectors.currentUser(getState());
    const widgetSets = await api.getWidgetSets(user.get('id'));
    dispatch(finishLoad(widgetSets));
  };
}


export const MOVE_WIDGET = 'MOVE_WIDGET';
export function moveWidget(widgetSet, id, coordinates) {
  return (dispatch, getState) => {
    dispatch({type: MOVE_WIDGET, widgetSet, id, coordinates});
    const user = login.selectors.currentUser(getState());
    const widget = allWidgetSets(getState()).getIn([widgetSet.get('id'), 'widgets', id]);
    api.updateWidget(user.get('id'), widgetSet.get('id'), widget);
  };
}

export const ADD_NEW_WIDGET = 'ADD_NEW_WIDGET';
export const PERSIST_NEW_WIDGET = 'PERSIST_NEW_WIDGET';
export function addWidget(widgetSet, widgetType) {
  return async (dispatch, getState) => {
    dispatch({type: ADD_NEW_WIDGET, widgetSet, widgetType});
    const user = login.selectors.currentUser(getState());
    const newWidget = allWidgetSets(getState()).getIn([widgetSet.get('id'), 'newWidget']);
    const persistedWidget = await api.createWidget(user.get('id'), widgetSet.get('id'), newWidget);
    dispatch({type: PERSIST_NEW_WIDGET, widgetSet, widget: persistedWidget});
  };
}

export const LOAD_WELL_TIMELINE = 'LOAD_WELL_TIMELINE';
export function loadWellTimeline(wellId, drillTime) {
  return async dispatch => {
    const timeline = await api.getWellTimeline(wellId);
    dispatch({type: LOAD_WELL_TIMELINE, wellId, drillTime, timeline});
  };
}

export const TOGGLE_DRILL_SCROLL_BAR = 'TOGGLE_DRILL_SCROLL_BAR';
export function toggleDrillScrollBar(wellId, visible) {
  return {type: TOGGLE_DRILL_SCROLL_BAR, wellId, visible};
}

export const SET_DRILL_TIME = 'SET_DRILL_TIME';
export function setDrillTime(wellId, time) {
  return {type: SET_DRILL_TIME, wellId, time};
}