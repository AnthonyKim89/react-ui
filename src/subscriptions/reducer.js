import { List, Map } from 'immutable';

import * as t from './actions';

const initialState = Map({
  appSubscriptions: Map(),
  appData: Map()
});

/**
 * Processes data that comes in and prepares it for use in the apps.
 * In many (most) cases the data won't be touched at all.
 * @param state
 * @param action
 * @returns {Stack.<T|U>|List<T>|Number|Stack<T>|Cursor|List.<T|U>|*}
 */
function processNewSubscriptionData(state, action) {
  let behavior = action.params.get("behavior", false);

  if (behavior && List.isList(action.data)) {
    let currentData = state.getIn(['appData', action.appInstanceId, action.devKey, action.collection, action.event || '']);
    if (currentData) {
      // Custom data processing for various subscription behaviors.
      if (behavior === "turnover") {
        // If the turnover behavior is set, we slice off the number of rows we're going to add, and add the new rows
        currentData = currentData.slice(0, -action.data.count());
        action.data = currentData.unshift(...action.data);
      } else if (behavior === "accumulate") {
        // If the accumulate behavior is set, we add the new rows to the data and keep the old data
        action.data = currentData.unshift(...action.data);
      }
    }
  }
  return action.data;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.SUBSCRIBE_APP:
      return state.setIn(
        ['appSubscriptions', action.appInstanceId, action.devKey, action.collection, action.event || ''],
        Map({
          assetId: action.assetId,
          params: action.params,
        })
      );
    case t.UNSUBSCRIBE_APP:
      return action.subscriptionKeys.reduce(
        (state, subKey) => state.removeIn(['appSubscriptions', action.appInstanceId, subKey.devKey, subKey.collection, subKey.event || ''])
                                .removeIn(['appData', action.appInstanceId, subKey.devKey, subKey.collection, subKey.event || '']),
        state
      );
    case t.RECEIVE_APP_DATA:
      const activeSub = state.getIn(['appSubscriptions', action.appInstanceId, action.devKey, action.collection, action.event || '']);
      if (activeSub && activeSub.get('assetId') === action.assetId && activeSub.get('params').equals(action.params)) {
        return state.setIn(['appData', action.appInstanceId, action.devKey, action.collection, action.event || ''], processNewSubscriptionData(state, action));
      } else {
        return state;
      }
    default:
      return state;
  }
};
