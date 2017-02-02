import { createSelector } from 'reselect'
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);


export function firstSubData(data, [{appKey, collection}]) {
  return data && data.getIn([appKey, collection]);
}