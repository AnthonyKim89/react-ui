import { List, Map } from 'immutable';

import AxialLoadApp from './AxialLoadApp';
import AxialLoadChartColorsSettingEditor from './AxialLoadChartColorsSettingEditor';
import * as constants from './constants';

export default {
  AppComponent: AxialLoadApp,
  settingsEditors: List([
    Map({
      name: 'graphColors',
      title: 'Graph Colors',
      required: false,
      Editor: AxialLoadChartColorsSettingEditor
    })
  ]),
  constants
};