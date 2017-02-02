import { Map } from 'immutable';

import * as t from './actions';

const initialState = Map({
  appSubscriptions: Map(),
  appData: Map()
});

export default function(state = initialState, action) {
  switch (action.type) {
    case t.SUBSCRIBE_APP:
      return state.setIn(
        ['appSubscriptions', action.appInstanceId, action.appKey, action.collection],
        Map({
          assetId: action.assetId,
          params: action.params,
        })
      );
    case t.UNSUBSCRIBE_APP:
      return action.subscriptionKeys.reduce(
        (state, subKey) => state.removeIn(['appSubscriptions', action.appInstanceId, subKey.appKey, subKey.collection])
                                .removeIn(['appData', action.appInstanceId, subKey.appKey, subKey.collection]),
        state
      );
    case t.RECEIVE_APP_DATA:
      const activeSub = state.getIn(['appSubscriptions', action.appInstanceId, action.appKey, action.collection]);
      if (activeSub &&
          activeSub.get('assetId') === action.assetId &&
          activeSub.get('params').equals(action.params)) {
        return state.setIn(['appData', action.appInstanceId, action.appKey, action.collection], action.data);
      } else {
        return state;
      }
    default:
      return state;
  }
};
