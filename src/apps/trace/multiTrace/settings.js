import { List, Map } from 'immutable';

import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { SUPPORTED_CHART_SERIES } from './constants';
import { DEFAULT_TIME_PERIOD } from '../constants';
import TraceSettingEditor from '../TraceSettingEditor';
import TraceTimePeriodSettingEditor from '../TraceTimePeriodSettingEditor';

export default List([
  Map({
    name: 'trace1',
    title: 'Trace 1',
    required: false,
    Editor: TraceSettingEditor
  }),
  Map({
    name: 'trace2',
    title: 'Trace 2',
    required: false,
    Editor: TraceSettingEditor
  }),
  Map({
    name: 'trace3',
    title: 'Trace 3',
    required: false,
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
  })
]);
