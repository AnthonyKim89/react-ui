import { List, Map } from 'immutable';

import SingleTraceGraphColorSettingEditor from './SingleTraceGraphColorSettingEditor';
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
    Editor: SingleTraceGraphColorSettingEditor
  }),
  Map({
    name: 'timePeriod',
    title: 'Time Period',
    required: false,
    Editor: TraceTimePeriodSettingEditor
  })
]);
