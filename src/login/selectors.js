import { flow } from 'lodash';
import { NAME } from './constants';

const getState = state => state[NAME];

export const currentUser = flow(getState, s => s.get('currentUser'));
export const loginFailure = flow(getState, s => s.get('loginFailure')); 