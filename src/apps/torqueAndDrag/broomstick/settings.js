import { List, Map } from 'immutable';

import BroomstickChartColorsSettingEditor from './BroomstickChartColorsSettingEditor';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: BroomstickChartColorsSettingEditor
  })
]);