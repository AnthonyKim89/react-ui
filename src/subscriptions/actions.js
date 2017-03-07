import { Map } from 'immutable';
import * as api from '../api';
import * as client from './subscriptionClient';

export function connect() {
  return async dispatch => {
    client.connect((...a) => dispatch(receiveAppData(...a)));
  };
}

export function disconnect() {
  client.disconnect();
}

export const SUBSCRIBE_APP = 'SUBSCRIBE_APP';
export function subscribeApp(appInstanceId, subscriptions, assetId, additionalParams = Map()) {
  return async dispatch => {
    // Only subscribe to live data if we're not asked for a historical time point
    if (!additionalParams.get('time')) {
      for (const {devKey, collection, event = '', params = Map()} of subscriptions) {
        client.subscribe(appInstanceId, devKey, collection, assetId, event, additionalParams.merge(params));
      }
    }
    for (const {devKey, collection, event = '', params = Map()} of subscriptions) {
      const allParams = additionalParams.merge(params);
      dispatch({type: SUBSCRIBE_APP, appInstanceId, devKey, collection, assetId, event, params: allParams});
      const initialData = await api.getAppStorage(devKey, collection, assetId, allParams);
      if (!initialData.isEmpty()) {
        // Usually apps expect one item. Those that explicitly set a limit expect a collection of items.
        const items = allParams.has('limit') ? initialData : initialData.first();
        dispatch(receiveAppData(appInstanceId, devKey, collection, assetId, event, allParams, items));
      }
    }
  };
}

export const UNSUBSCRIBE_APP = 'UNSUBSCRIBE_APP';
export function unsubscribeApp(appInstanceId, subscriptionKeys) {
  for (const {devKey, collection, event = ''} of subscriptionKeys) {
    client.unsubscribe(appInstanceId, devKey, collection, event);
  }
  return {type: UNSUBSCRIBE_APP, appInstanceId, subscriptionKeys};
}

export const RECEIVE_APP_DATA = 'RECEIVE_APP_DATA';
export function receiveAppData(appInstanceId, devKey, collection, assetId, event, params, data) {
  return {type: RECEIVE_APP_DATA, appInstanceId, devKey, collection, assetId, event, params, data};
}
