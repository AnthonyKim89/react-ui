import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { PERIOD_TYPES, ROP_TYPES } from './constants';

export default List([
  Map({
    name: 'period',
    title: 'Period',
    required: true,
    includeInSubscriptionParams: true,
    default: PERIOD_TYPES[0].value,
    Editor: dropdownEditorForDefinitions(PERIOD_TYPES)
  }),
  Map({
  	name: 'ropType',
  	title: '',
  	required: false,
  	Editor: radioEditorForDefinitions(ROP_TYPES, ROP_TYPES[0].value)
  })
]);
