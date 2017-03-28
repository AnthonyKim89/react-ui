import { List } from 'immutable';

import FluidChecksApp from './FluidChecksApp';
import * as constants from './constants';

export default {
  AppComponent: FluidChecksApp,
  settings: List(),
  constants
};
