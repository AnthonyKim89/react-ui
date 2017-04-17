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
    for (const {provider, collection, event = '', params = Map()} of subscriptions) {
      const allParams = additionalParams.merge(params);

      // Only subscribe to live data if we're not asked for a historical time point
      if (!allParams.get('time') || allParams.get('alwaysSubscribe')) {
        client.subscribe(appInstanceId, provider, collection, assetId, event, allParams);
      }

      dispatch({type: SUBSCRIBE_APP, appInstanceId, provider, collection, assetId, event, params: allParams});
      const initialData = await api.getAppStorage(provider, collection, assetId, allParams);
      if (!initialData.isEmpty()) {
        // Usually apps expect one item. Those that explicitly set a limit expect a collection of items.
        const items = allParams.has('limit') ? initialData : initialData.last();
        dispatch(receiveAppData(appInstanceId, provider, collection, assetId, event, allParams, items));
      }
    }
  };
}

export const UNSUBSCRIBE_APP = 'UNSUBSCRIBE_APP';
export function unsubscribeApp(appInstanceId, subscriptionKeys) {
  for (const {provider, collection, event = ''} of subscriptionKeys) {
    client.unsubscribe(appInstanceId, provider, collection, event);
  }
  return {type: UNSUBSCRIBE_APP, appInstanceId, subscriptionKeys};
}

export const RECEIVE_APP_DATA = 'RECEIVE_APP_DATA';
export function receiveAppData(appInstanceId, provider, collection, assetId, event, params, data) {
  return {type: RECEIVE_APP_DATA, appInstanceId, provider, collection, assetId, event, params, data};
}
