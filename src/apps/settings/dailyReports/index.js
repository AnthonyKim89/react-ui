import { List } from 'immutable';

import DailyReportsApp from './DailyReportsApp';
import * as constants from './constants';

export default {
  AppComponent: DailyReportsApp,
  settings: List(),
  constants
};
