import { List, Map } from 'immutable';

import BroomstickApp from './BroomstickApp';
import BroomstickChartColorsSettingEditor from './BroomstickChartColorsSettingEditor';
import * as constants from './constants';

export default {
  AppComponent: BroomstickApp,
  settingsEditors: List([
    Map({
      name: 'graphColors',
      title: 'Graph Colors',
      required: false,
      Editor: BroomstickChartColorsSettingEditor
    })
  ]),
  constants
};