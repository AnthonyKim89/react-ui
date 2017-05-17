import { List, Map } from 'immutable';

import { ORIENTATION_SETTINGS } from '../../../apps/constants';
import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { SUPPORTED_CHART_SERIES } from './constants';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: chartColorsEditorForDefinitions(SUPPORTED_CHART_SERIES)
  }),
  Map({
    name: 'orientation',
    title: 'Orientation',
    required: false,
    Editor: radioEditorForDefinitions(ORIENTATION_SETTINGS, ORIENTATION_SETTINGS[0].value)
  })
]);
