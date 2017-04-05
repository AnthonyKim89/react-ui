import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { PERIOD_TYPES, SUPPORTED_CONNECTIONS } from './constants';

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
  	name: 'connectionType',
  	title: 'Connection Type',
  	required: true,
  	includeInSubscriptionParams: true,
  	default: SUPPORTED_CONNECTIONS[0].type,
  	Editor: dropdownEditorForDefinitions(SUPPORTED_CONNECTIONS.map(h => ({
  		label: h.title,
  		value: h.type
  	})))
  })
]);
