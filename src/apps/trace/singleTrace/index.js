import { List, Map } from 'immutable';

import SingleTraceApp from './SingleTraceApp';
import SingleTraceGraphColorSettingEditor from './SingleTraceGraphColorSettingEditor';
import TraceSettingEditor from './TraceSettingEditor';
import TraceTimePeriodSettingEditor from './TraceTimePeriodSettingEditor';

import * as constants from './constants';

export default {
  AppComponent: SingleTraceApp,
  settingsEditors: List([
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
  ]),
  constants
};
