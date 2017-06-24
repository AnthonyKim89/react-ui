import { push } from 'react-router-redux';

import * as api from '../api';
import { dashboards, allDashboards } from './selectors';
import login from '../login';
import subscriptions from '../subscriptions';
import * as nativeMessages from '../nativeMessages';

export const START_LOAD = 'START_LOAD';
function startLoad(isNative) {
  return {type: START_LOAD, isNative};
}

export const FINISH_LOAD = 'FINISH_LOAD';
function finishLoad(dashboardsList) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_LOAD, dashboardsList});

    let dashboard = dashboards(getState()).first();

    const currentPath = getState().routing.locationBeforeTransitions.pathname;
    if (currentPath === '/') {
      dispatch(push(`/dashboards/${dashboard.get('slug')}`));
    }
    nativeMessages.notifyPageLoaded();
  };
}

export const FINISH_RELOAD = 'FINISH_RELOAD';
function finishReload(dashboardsList, overrideDashboard=null, assetId=null) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_RELOAD, dashboardsList});

    let dashboard;
    if (overrideDashboard === null) {
      dashboard = dashboards(getState()).first();
    } else {
      dashboard = overrideDashboard;
    }

    if (assetId === null) {
      dispatch(push(`/dashboards/${dashboard.get('slug')}`));
    } else {
      dispatch(push(`/assets/${assetId}/${dashboard.get('slug')}`));
    }
    nativeMessages.notifyPageLoaded();
  };
}

export function start(isNative) {
  return async (dispatch, getState) => {
    dispatch(startLoad(isNative));
    dispatch(subscriptions.actions.connect());
    const user = login.selectors.currentUser(getState());
    const dashboards = await api.getDashboards(user.get('id'));
    dispatch(finishLoad(dashboards));
  };
}

export const MOVE_APP = 'MOVE_APP';
export function moveApp(dashboard, id, coordinates) {
  return (dispatch, getState) => {
    dispatch({type: MOVE_APP, dashboard, id, coordinates});
    const user = login.selectors.currentUser(getState());
    const app = allDashboards(getState()).getIn([dashboard.get('id'), 'apps', id]);
    api.updateApp(user.get('id'), dashboard.get('id'), app);
  };
}

export const UPDATE_DASHBOARDS = 'UPDATE_DASHBOARDS';
export function updateDashboards(dashboard=null, assetId=null) {
  return async (dispatch, getState) => {
    const user = login.selectors.currentUser(getState());
    const dashboards = await api.getDashboards(user.get('id'));
    dispatch(finishReload(dashboards, dashboard, assetId));
  };
}

export const UPDATE_APP_SETTINGS = 'UPDATE_APP_SETTINGS';
export function updatedashboardtings(dashboard, id, settings) {
  return (dispatch, getState) => {
    dispatch({type: UPDATE_APP_SETTINGS, dashboard, id, settings});
    const user = login.selectors.currentUser(getState());
    const app = allDashboards(getState()).getIn([dashboard.get('id'), 'apps', id]);
    api.updateApp(user.get('id'), dashboard.get('id'), app);
  };
}

export const ADD_NEW_APP = 'ADD_NEW_APP';
export const PERSIST_NEW_APP = 'PERSIST_NEW_APP';
export function addApp(dashboard, appType, dashboardtings) {
  return async (dispatch, getState) => {
    dispatch({type: ADD_NEW_APP, dashboard, appType, settings: dashboardtings});
    const user = login.selectors.currentUser(getState());
    const newApp = allDashboards(getState()).getIn([dashboard.get('id'), 'newApp']);
    const persistedApp = await api.createApp(user.get('id'), dashboard.get('id'), newApp);
    dispatch({type: PERSIST_NEW_APP, dashboard, app: persistedApp});
  };
}

export const REMOVE_APP = 'REMOVE_APP';
export function removeApp(dashboard, id) {
  return async (dispatch, getState) => {
    const user = login.selectors.currentUser(getState());
    await api.deleteApp(user.get('id'), dashboard.get('id'), id);
    dispatch({type: REMOVE_APP, dashboard, id});
  };
}

export const SET_PAGE_PARAMS = 'SET_PAGE_PARAMS';
export function setPageParams(assetId, params) {
  return {type: SET_PAGE_PARAMS, assetId, params};
}
