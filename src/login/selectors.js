import { flow } from 'lodash';
import { NAME } from './constants';

const getState = state => state[NAME];

export const getCurrentUser = flow(getState, s => s.get('currentUser'));
