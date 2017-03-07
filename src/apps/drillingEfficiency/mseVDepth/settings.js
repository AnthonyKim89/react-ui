import { List, Map } from 'immutable';

import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { SUPPORTED_CHART_SERIES } from './constants';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: chartColorsEditorForDefinitions(SUPPORTED_CHART_SERIES)
  })
]);
