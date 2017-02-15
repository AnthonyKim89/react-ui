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
export function subscribeApp(appInstanceId, subscriptionKeys, assetId, params) {
  return async dispatch => {
    // Only subscribe to live data if we're not asked for a historical time point
    if (!params.get('time')) {
      for (const {appKey, collection} of subscriptionKeys) {
        client.subscribe(appInstanceId, appKey, collection, assetId, params);
      }
    }
    for (const {appKey, collection} of subscriptionKeys) {
      dispatch({type: SUBSCRIBE_APP, appInstanceId, appKey, collection, assetId, params});
      const initialData = await api.getAppStorage(appKey, collection, assetId, params);
      dispatch(receiveAppData(appInstanceId, appKey, collection, assetId, params, initialData));
    }
  };
}

export const UNSUBSCRIBE_APP = 'UNSUBSCRIBE_APP';
export function unsubscribeApp(appInstanceId, subscriptionKeys) {
  for (const {appKey, collection} of subscriptionKeys) {
    client.unsubscribe(appInstanceId, appKey, collection);
  }
  return {type: UNSUBSCRIBE_APP, appInstanceId, subscriptionKeys};
}

export const RECEIVE_APP_DATA = 'RECEIVE_APP_DATA';
export function receiveAppData(appInstanceId, appKey, collection, assetId, params, data) {
  return {type: RECEIVE_APP_DATA, appInstanceId, appKey, collection, assetId, params, data};
}
