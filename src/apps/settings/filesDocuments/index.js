import { List } from 'immutable';

import FilesDocumentsApp from './FilesDocumentsApp';
import * as constants from './constants';

export default {
  AppComponent: FilesDocumentsApp,
  settings: List(),
  constants
};
