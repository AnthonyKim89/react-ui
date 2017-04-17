import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { PERIOD_TYPES, SUPPORTED_OPERATIONS } from './constants';

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
  	name: 'operationType',
  	title: 'OPERATION Type',
  	required: true,
  	includeInSubscriptionParams: true,
  	default: SUPPORTED_OPERATIONS[0].type,
  	Editor: dropdownEditorForDefinitions(SUPPORTED_OPERATIONS.map(h => ({
  		label: h.title,
  		value: h.type
  	})))
  })
]);
