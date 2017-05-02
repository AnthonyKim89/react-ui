import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { textEditorForDefinitions } from '../../../common/TextEditor';
import { PERIOD_TYPES, SUPPORTED_OPERATIONS, DEFAULT_TARGET } from './constants';

export default List([
  Map({
    name: 'period',
    title: 'Period',
    required: true,
    includeInSubscriptionParams: false,
    default: PERIOD_TYPES[0].value,
    Editor: dropdownEditorForDefinitions(PERIOD_TYPES)
  }),
  Map({
  	name: 'operationType',
  	title: 'Operation Type',
  	required: true,
  	includeInSubscriptionParams: false,
  	default: SUPPORTED_OPERATIONS[0].type,
  	Editor: dropdownEditorForDefinitions(SUPPORTED_OPERATIONS.map(h => ({
  		label: h.title,
  		value: h.type
  	})))
  }),
  Map({
    name: 'target',
    title: 'Target',
    required: false,
    Editor: textEditorForDefinitions('', DEFAULT_TARGET)
  })
]);
