import * as api from '../api';
import { push } from 'react-router-redux'
import { dashboards, allAppSets } from './selectors';
import login from '../login';

export const START_LOAD = 'START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'FINISH_LOAD';
function finishLoad(appSets) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_LOAD, appSets});
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
    const appSets = await api.getAppSets(user.get('id'));
    dispatch(finishLoad(appSets));
  };
}


export const MOVE_APP = 'MOVE_APP';
export function moveApp(appSet, id, coordinates) {
  return (dispatch, getState) => {
    dispatch({type: MOVE_APP, appSet, id, coordinates});
    const user = login.selectors.currentUser(getState());
    const app = allAppSets(getState()).getIn([appSet.get('id'), 'apps', id]);
    api.updateApp(user.get('id'), appSet.get('id'), app);
  };
}

export const ADD_NEW_APP = 'ADD_NEW_APP';
export const PERSIST_NEW_APP = 'PERSIST_NEW_APP';
export function addApp(appSet, appType, appSettings) {
  return async (dispatch, getState) => {
    dispatch({type: ADD_NEW_APP, appSet, appType, settings: appSettings});
    const user = login.selectors.currentUser(getState());
    const newApp = allAppSets(getState()).getIn([appSet.get('id'), 'newApp']);
    const persistedApp = await api.createApp(user.get('id'), appSet.get('id'), newApp);
    dispatch({type: PERSIST_NEW_APP, appSet, app: persistedApp});
  };
}

export const REMOVE_APP = 'REMOVE_APP';
export function removeApp(appSet, id) {
  return async (dispatch, getState) => {
    const user = login.selectors.currentUser(getState());
    await api.deleteApp(user.get('id'), appSet.get('id'), id);
    dispatch({type: REMOVE_APP, appSet, id});
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