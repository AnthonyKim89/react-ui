import { List, Map } from 'immutable';

import { dropdownEditorForDefinitions } from '../../../common/DropdownEditor';
import { GRAPH_TYPES } from './constants';

export default List([
  Map({
  	name: 'graphType',
  	title: '',
  	default: GRAPH_TYPES[0].value,
  	Editor: dropdownEditorForDefinitions(GRAPH_TYPES)
  })
]);
