import { fromJS } from 'immutable';
import subscriptionsReducer from './reducer';
import * as actions from './actions';

it('stores information about subscriptions by app instance id and subscription key', () => {
  const state = subscriptionsReducer(
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
  const state = subscriptionsReducer(
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
  const state = subscriptionsReducer(
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
  const state = subscriptionsReducer(
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
  const state = subscriptionsReducer(
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