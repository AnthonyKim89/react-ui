import { createSelector } from 'reselect'
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);
