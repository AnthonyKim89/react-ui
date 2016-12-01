import { fromJS } from 'immutable';
import pagesReducer from './reducer';
import * as actions from './actions';

it('initializes to empty pages', () => {
  const initialState = pagesReducer(undefined, actions.START_LOAD);
  expect(initialState.get('isLoading')).toBe(true);
});

it('maps widget sets and widgets by id when loaded', () => {
  const resultData = {
    user: fromJS({id: 42}),
    widgetSets: fromJS([{
      id: 'ws1',
      widgets: [{id: 'w1'}, {id: 'w2'}]
    }, {
      id: 'ws2',
      widgets: [{id: 'w3'}, {id: 'w4'}]
    }])
  };
  const state = pagesReducer(
    fromJS({isLoading: true}),
    {type: actions.FINISH_LOAD, data: resultData}
  );

  expect(state.get('widgetSets').toJS()).toEqual({
    ws1: {
      id: 'ws1',
      widgets: {w1: {id: 'w1'}, w2: {id: 'w2'}}
    },
    ws2: {
      id: 'ws2',
      widgets: {w3: {id: 'w3'}, w4: {id: 'w4'}}
    }
  });
});