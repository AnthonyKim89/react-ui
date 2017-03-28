import { List } from 'immutable';

import CostsApp from './CostsApp';
import * as constants from './constants';

export default {
  AppComponent: CostsApp,
  settings: List(),
  constants
};
