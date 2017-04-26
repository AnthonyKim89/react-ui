import { List } from 'immutable';

import OperationSummariesApp from './OperationSummariesApp';
import * as constants from './constants';

export default {
  AppComponent: OperationSummariesApp,
  settings: List(),
  constants
};
