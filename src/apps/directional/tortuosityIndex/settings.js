import { List, Map } from 'immutable';

import { ORIENTATION_SETTINGS } from '../../../apps/constants';
import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { textEditorForDefinitions } from '../../../common/TextEditor';
import { SUPPORTED_CHART_SERIES, DEFAULT_LIMIT } from './constants';

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
  }),
  Map({
    name: 'limit',
    title: 'Safe Limit',
    required: false,
    Editor: textEditorForDefinitions('', DEFAULT_LIMIT)
  })
]);