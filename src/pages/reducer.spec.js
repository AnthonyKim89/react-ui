import { fromJS } from 'immutable';
import pagesReducer from './reducer';
import * as actions from './actions';

it('initializes to empty pages and not loading', () => {
  const initialState = pagesReducer(undefined, actions.START_LOAD);
  expect(initialState.get('isLoading')).toBe(false);
});

it('maps app sets and apps by id when loaded', () => {
  const resultData = fromJS([{
    id: 'ws1',
    apps: [{id: 'w1'}, {id: 'w2'}]
  }, {
    id: 'ws2',
    apps: [{id: 'w3'}, {id: 'w4'}]
  }]);
  const state = pagesReducer(
    fromJS({isLoading: true}),
    {type: actions.FINISH_LOAD, appSets: resultData}
  );

  expect(state.get('appSets').toJS()).toEqual({
    ws1: {
      id: 'ws1',
      apps: {w1: {id: 'w1'}, w2: {id: 'w2'}}
    },
    ws2: {
      id: 'ws2',
      apps: {w3: {id: 'w3'}, w4: {id: 'w4'}}
    }
  });
});

it('stores information about subscriptions by app instance id and subscription key', () => {
  const state = pagesReducer(
    fromJS({}),
    {
      type: actions.SUBSCRIBE_APP,
      appInstanceId: 'instanceId',
      subscriptionKey: 'sub',
      assetId: 'asset',
      params: {}
    }
  );

  expect(state.get('appSubscriptions').toJS()).toEqual({
    instanceId: {
      sub: {
        assetId: 'asset',
        params: {}
      }
    }
  });
});

it('unsubscribes all given subscription keys but not others', () => {
  const state = pagesReducer(
    fromJS({
      appSubscriptions: {
        instance1: {
          sub1: {},
          sub2: {},
          sub3: {}
        },
        instance2: {
          sub1: {},
          sub2: {}
        }
      }
    }),
    {
      type: actions.UNSUBSCRIBE_APP,
      appInstanceId: 'instance1',
      subscriptionKeys: ['sub1', 'sub2']
    }
  );

  expect(state.get('appSubscriptions').toJS()).toEqual({
    instance1: {
      sub3: {}
    },
    instance2: {
      sub1: {},
      sub2: {}
    }
  });
});


it('stores app subscription data by app key and subscription id', () => {
  const state = pagesReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          sub: {
            assetId: 'asset',
            params: {}
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      subscriptionKey: 'sub',
      assetId: 'asset',
      params: fromJS({}),
      data: {some: 'data'}
    }
  );

  expect(state.get('appData').toJS()).toEqual({
    instanceId: {
      sub: {some: 'data'}
    }
  });
});

it('does not accept subscription data if asset id does not match', () => {
  const state = pagesReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          sub: {
            assetId: 'asset',
            params: {}
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      subscriptionKey: 'sub',
      assetId: 'some other asset',
      params: fromJS({}),
      data: {some: 'data'}
    }
  );

  expect(state.has('appData')).toBe(false);
});

it('does not accept subscription data if params do not match', () => {
  const state = pagesReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          sub: {
            assetId: 'asset',
            params: {someParam: true}
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      subscriptionKey: 'sub',
      assetId: 'asset',
      params: fromJS({someParam: false}),
      data: {some: 'data'}
    }
  );

  expect(state.has('appData')).toBe(false);
});