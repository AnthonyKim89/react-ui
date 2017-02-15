import { push } from 'react-router-redux'

import * as api from '../api';
import { dashboards, allAppSets } from './selectors';
import login from '../login';
import subscriptions from '../subscriptions';

export const START_LOAD = 'START_LOAD';
function startLoad(isNative) {
  return {type: START_LOAD, isNative};
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
    // Send load notification for native app message handler when present
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.swiftHandler) {
      window.webkit.messageHandlers.swiftHandler.postMessage('pageLoaded');
    }
  };
}

export function start(isNative) {
  return async (dispatch, getState) => {
    dispatch(startLoad(isNative));
    dispatch(subscriptions.actions.connect());
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

export const UPDATE_APP_SETTINGS = 'UPDATE_APP_SETTINGS';
export function updateAppSettings(appSet, id, settings) {
  return (dispatch, getState) => {
    dispatch({type: UPDATE_APP_SETTINGS, appSet, id, settings});
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

export const SET_PAGE_PARAMS = 'SET_PAGE_PARAMS';
export function setPageParams(assetId, params) {
  return {type: SET_PAGE_PARAMS, assetId, params};
}
