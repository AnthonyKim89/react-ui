import { push } from 'react-router-redux'
import { List } from 'immutable';
import { last } from 'lodash';

import * as api from '../api';
import * as subscriptions from '../subscriptions';
import { ASSET_TYPES } from './constants';
import { dashboards, allAppSets, assets } from './selectors';
import login from '../login';
import { subscribe, unsubscribe } from '../subscriptions';

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
  };
}

export function start(isNative) {
  return async (dispatch, getState) => {
    dispatch(startLoad(isNative));
    subscriptions.connect((...a) => dispatch(receiveAppData(...a)));
    const user = login.selectors.currentUser(getState());
    const appSets = await api.getAppSets(user.get('id'));
    dispatch(finishLoad(appSets));
  };
}

export const SUBSCRIBE_APP = 'SUBSCRIBE_APP';
export function subscribeApp(appInstanceId, appKey, assetId, params) {
  return async dispatch => {
    // Only subscribe to live data if we're not asked for a historical time point
    if (!params.get('time')) {
      subscribe(appInstanceId, appKey, assetId, params);
    }
    dispatch({type: SUBSCRIBE_APP, appInstanceId, appKey, assetId, params});
    const initialData = await api.getAppResults(appKey, assetId, params);
    dispatch(receiveAppData(appInstanceId, assetId, params, initialData));
  };
}

export const UNSUBSCRIBE_APP = 'UNSUBSCRIBE_APP';
export function unsubscribeApp(appInstanceId) {
  unsubscribe(appInstanceId);
  return {type: UNSUBSCRIBE_APP, appInstanceId};
}

export const RECEIVE_APP_DATA = 'RECEIVE_APP_DATA';
export function receiveAppData(appInstanceId, assetId, params, data) {
  return {type: RECEIVE_APP_DATA, appInstanceId, assetId, params, data};
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

export const LOAD_ASSETS = 'LOAD_ASSETS';

export function loadAsset(assetId) {
  return async (dispatch, getState) => {
    const loadedAsset = assets(getState()).get(assetId);
    if (!loadedAsset || (isResolvableAsset(loadedAsset) && !isResolvedAsset(loadedAsset))) {
      let assets = List().push(await api.getAsset(assetId));
      while (isResolvableAsset(assets.last())) {
        const parent = assets.last();
        const child = await api.getActiveChildAsset(parent.get('id'));
        assets = assets
          .butLast()
          .push(parent.set('activeChildId', child.get('id')))
          .push(child);
      }
      dispatch({type: LOAD_ASSETS, assets});
    }
  }
}

export function listAssets(assetType) {
  return async (dispatch, getState) => {
    // Load all parent assets as well, by checking the ancestor asset types of this asset type
    // and loading assets of all those types.
    const assetTypesToResolve = [assetType];
    while (ASSET_TYPES.get(last(assetTypesToResolve)).has('parent_type')) {
      assetTypesToResolve.push(ASSET_TYPES.getIn([last(assetTypesToResolve), 'parent_type']));
    }
    const assets = await api.getAssets(assetTypesToResolve);
    dispatch({type: LOAD_ASSETS, assets});
  }
}

/*
 * Check if an asset should be "resolved" to another active asset.
 * Currently we just check if it's a rig (which has an active well)
 * but a more generic solution would be preferable.
 */
function isResolvableAsset(asset) {
  return asset.get('type') === 'rig';
}
function isResolvedAsset(asset) {
  return asset.has('activeChildId');
}