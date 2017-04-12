import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { PERIOD_TYPES, DISPLAY_FORMATS } from './constants';

export default List([
  Map({
    name: 'period',
    title: 'Period',
    required: false,
    // includeInSubscriptionParams: true,
    default: PERIOD_TYPES[0].value,
    Editor: dropdownEditorForDefinitions(PERIOD_TYPES)
  }),
  Map({
  	name: 'displayFormat',
  	title: '',
  	required: false,
  	Editor: radioEditorForDefinitions(DISPLAY_FORMATS, DISPLAY_FORMATS[0].value)
  })
]);
