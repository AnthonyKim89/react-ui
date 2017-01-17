import { List, Map } from 'immutable';

import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { SUPPORTED_CHART_SERIES } from './constants';
import TraceSettingEditor from './TraceSettingEditor';
import TraceTimePeriodSettingEditor from './TraceTimePeriodSettingEditor';

export default List([
  Map({
    name: 'trace',
    title: 'Trace',
    required: true,
    Editor: TraceSettingEditor
  }),
  Map({
    name: 'graphColors',
    title: 'Graph Color',
    required: false,
    Editor: chartColorsEditorForDefinitions(SUPPORTED_CHART_SERIES)
  }),
  Map({
    name: 'timePeriod',
    title: 'Time Period',
    required: false,
    Editor: TraceTimePeriodSettingEditor
  })
]);
