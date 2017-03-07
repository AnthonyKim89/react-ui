import { fromJS } from 'immutable';
import subscriptionsReducer from './reducer';
import * as actions from './actions';

it('stores information about subscriptions by app instance id and subscription key', () => {
  const state = subscriptionsReducer(
    fromJS({}),
    {
      type: actions.SUBSCRIBE_APP,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
      assetId: 'asset',
      event: 'update',
      params: {}
    }
  );

  expect(state.get('appSubscriptions').toJS()).toEqual({
    instanceId: {
      'corva.torque_and_drag.overview': {
        results: {
          update: {
            assetId: 'asset',
            params: {}
          }
        }
      }
    }
  });
});

it('can store information about subscriptions for no specific event', () => {
  const state = subscriptionsReducer(
    fromJS({}),
    {
      type: actions.SUBSCRIBE_APP,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
      assetId: 'asset',
      params: {}
    }
  );

  expect(state.get('appSubscriptions').toJS()).toEqual({
    instanceId: {
      'corva.torque_and_drag.overview': {
        results: {
          '': {
            assetId: 'asset',
            params: {}
          }
        }
      }
    }
  });
});

it('unsubscribes all given subscription keys but not others', () => {
  const state = subscriptionsReducer(
    fromJS({
      appSubscriptions: {
        instance1: {
          'corva.torque_and_drag.overview': {results: {'': {}}},
          'corva.torque_and_drag.torque': {results: {'': {}}},
          'corva.torque_and_drag.drag': {results: {'': {}}}
        },
        instance2: {
          'corva.torque_and_drag.overview': {results: {'': {}}},
          'corva.torque_and_drag.torque': {results: {'': {}}}
        }
      }
    }),
    {
      type: actions.UNSUBSCRIBE_APP,
      appInstanceId: 'instance1',
      subscriptionKeys: [
        {devKey: 'corva.torque_and_drag.overview', collection: 'results'},
        {devKey: 'corva.torque_and_drag.torque', collection: 'results'}
      ]
    }
  );

  expect(state.get('appSubscriptions').toJS()).toEqual({
    instance1: {
      'corva.torque_and_drag.overview': {results: {}},
      'corva.torque_and_drag.torque': {results: {}},
      'corva.torque_and_drag.drag': {results: {'': {}}}
    },
    instance2: {
      'corva.torque_and_drag.overview': {results: {'': {}}},
      'corva.torque_and_drag.torque': {results: {'': {}}}
    }
  });
});


it('stores app subscription data by app key and subscription id', () => {
  const state = subscriptionsReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          'corva.torque_and_drag.overview': {
            results: {
              '': {
                assetId: 'asset',
                params: {}
              }
            }
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
      assetId: 'asset',
      params: fromJS({}),
      data: {some: 'data'}
    }
  );

  expect(state.get('appData').toJS()).toEqual({
    instanceId: {
      'corva.torque_and_drag.overview': {results: {'': {some: 'data'}}}
    }
  });
});

it('does not accept subscription data if asset id does not match', () => {
  const state = subscriptionsReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          sub: {
            '': {
              assetId: 'asset',
              params: {}
            }
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
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
            '': {
              assetId: 'asset',
              params: {someParam: true}
            }
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
      assetId: 'asset',
      params: fromJS({}),
      data: {someParam: false}
    }
  );

  expect(state.has('appData')).toBe(false);
});

it('does not accept subscription data if event does not match', () => {
  const state = subscriptionsReducer(
    fromJS({
      appSubscriptions: {
        instanceId: {
          sub: {
            '': {
              assetId: 'asset',
              params: {someParam: true}
            }
          }
        }
      }
    }),
    {
      type: actions.RECEIVE_APP_DATA,
      appInstanceId: 'instanceId',
      devKey: 'corva.torque_and_drag.overview',
      collection: 'results',
      assetId: 'asset',
      event: 'update',
      params: fromJS({}),
      data: {someParam: true}
    }
  );

  expect(state.has('appData')).toBe(false);
});