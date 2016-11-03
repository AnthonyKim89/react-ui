import { flow } from 'lodash';
import { NAME } from './constants';

const getState = state => state[NAME];

export const isLoading = flow(getState, s => s.get('isLoading'));
export const getData   = flow(getState, s => s.get('data'));
