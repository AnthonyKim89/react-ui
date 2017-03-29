import { List, Map } from 'immutable';

import * as t from './actions';

const initialState = Map({
  appSubscriptions: Map(),
  appData: Map()
});

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

        // If this data is cumulative, we slice off the number of rows
        if (action.params.get("accumulate", false)) {
          if (List.isList(action.data)) {
            let currentData = state.getIn(['appData', action.appInstanceId, action.devKey, action.collection, action.event || '']);
            if (currentData !== undefined) {
              // Slicing off the number of rows that we're about to add and pushing the new rows onto
              // the end of the data to "accumulate" the new data instead of throwing the old away
              currentData = currentData.slice(0, -action.data.count());
              action.data = currentData.unshift(...action.data);
            }
          }
        }

        return state.setIn(['appData', action.appInstanceId, action.devKey, action.collection, action.event || ''], action.data);
      } else {
        return state;
      }
    default:
      return state;
  }
};
