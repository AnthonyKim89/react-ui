import { List, Map } from 'immutable';

import { ORIENTATION_SETTINGS } from '../../../apps/constants';
import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { SUPPORTED_CHART_SERIES } from './constants';
import { DEFAULT_TIME_PERIOD } from '../constants';
import TraceSettingEditor from '../TraceSettingEditor';
import TraceTimePeriodSettingEditor from '../TraceTimePeriodSettingEditor';

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
    name: 'timePeriodHours',
    title: 'Time Period',
    required: false,
    default: DEFAULT_TIME_PERIOD,
    Editor: TraceTimePeriodSettingEditor,
    includeInSubscriptionParams: true
  }),
  Map({
    name: 'orientation',
    title: 'Orientation',
    required: false,
    Editor: radioEditorForDefinitions(ORIENTATION_SETTINGS, ORIENTATION_SETTINGS[0].value)
  })
]);
