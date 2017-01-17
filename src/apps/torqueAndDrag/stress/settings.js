import { List, Map } from 'immutable';

import StressChartColorsSettingEditor from './StressChartColorsSettingEditor';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: StressChartColorsSettingEditor
  })
]);
