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
