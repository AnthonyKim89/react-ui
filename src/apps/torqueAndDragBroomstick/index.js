import { List, Map } from 'immutable';

import TorqueAndDragBroomstickApp from './TorqueAndDragBroomstickApp';
import GraphColorsSettingEditor from './GraphColorsSettingEditor';
import * as constants from './constants';

export default {
  AppComponent: TorqueAndDragBroomstickApp,
  settingsEditors: List([
    Map({
      name: 'graphColors',
      title: 'Graph Colors',
      Editor: GraphColorsSettingEditor
    })
  ]),
  constants
};