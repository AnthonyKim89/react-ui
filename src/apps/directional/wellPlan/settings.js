import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { chartColorsEditorForDefinitions } from '../../../common/ChartColorsEditor';
import { switchEditorForDefinitions } from '../../../common/SwitchEditor';
import { SUPPORTED_CHART_SERIES, GRAPH_TYPES } from './constants';

export default List([
  Map({
    name: 'graphColors',
    title: 'Graph Colors',
    required: false,
    Editor: chartColorsEditorForDefinitions(SUPPORTED_CHART_SERIES)
  }),
  Map({
    name: 'graphType',
    title: 'Graph Type',
    required: true,
    includeInSubscriptionParams: false,
    default: GRAPH_TYPES[0].type,
    Editor: dropdownEditorForDefinitions(GRAPH_TYPES.map(h => ({
      label: h.title,
      value: h.type
    })))
  }),
  Map({
    name: 'autoZoom',
    title: 'Auto Zoom',
    required: true,
    includeInSubscriptionParams: false,
    Editor: switchEditorForDefinitions(false)
  })
]);