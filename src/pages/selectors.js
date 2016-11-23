import { flow } from 'lodash';
import { NAME } from './constants';

const getState = state => state[NAME];

export const dashboards = flow(getState, s => s.get('dashboards'));
