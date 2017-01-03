import { List, Map } from 'immutable';

import StressApp from './StressApp';
import StressChartColorsSettingEditor from './StressChartColorsSettingEditor';
import * as constants from './constants';

export default {
  AppComponent: StressApp,
  settingsEditors: List([
    Map({
      name: 'graphColors',
      title: 'Graph Colors',
      required: false,
      Editor: StressChartColorsSettingEditor
    })
  ]),
  constants
};