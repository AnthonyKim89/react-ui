import { List, Map } from 'immutable';

import AxialLoadChartColorsSettingEditor from './AxialLoadChartColorsSettingEditor';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: AxialLoadChartColorsSettingEditor
  })
]);
