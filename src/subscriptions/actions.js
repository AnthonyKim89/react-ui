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
      for (const subscriptionKey of subscriptionKeys) {
        client.subscribe(appInstanceId, subscriptionKey, assetId, params);
      }
    }
    for (const subscriptionKey of subscriptionKeys) {
      dispatch({type: SUBSCRIBE_APP, appInstanceId, subscriptionKey, assetId, params});
      const initialData = await api.getAppResults(subscriptionKey, assetId, params);
      dispatch(receiveAppData(appInstanceId, subscriptionKey, assetId, params, initialData));
    }
  };
}

export const UNSUBSCRIBE_APP = 'UNSUBSCRIBE_APP';
export function unsubscribeApp(appInstanceId, subscriptionKeys) {
  for (const subscriptionKey of subscriptionKeys) {
    client.unsubscribe(appInstanceId, subscriptionKey);
  }
  return {type: UNSUBSCRIBE_APP, appInstanceId, subscriptionKeys};
}

export const RECEIVE_APP_DATA = 'RECEIVE_APP_DATA';
export function receiveAppData(appInstanceId, subscriptionKey, assetId, params, data) {
  return {type: RECEIVE_APP_DATA, appInstanceId, subscriptionKey, assetId, params, data};
}
