import { flow } from 'lodash';
import { NAME } from './constants';

const getState = state => state[NAME];

export const currentUser = flow(getState, s => s.get('currentUser'));
export const loginFailure = flow(getState, s => s.get('loginFailure'));
export const loggingIn = flow(getState, s => s.get('loggingIn'));
export const apiFailure = flow(getState, s => s.get('apiFailure'));
