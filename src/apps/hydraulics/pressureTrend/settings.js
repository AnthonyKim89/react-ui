import { List, Map } from 'immutable';

import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { DISPLAY_FORMATS } from './constants';

export default List([
  Map({
    name: 'displayFormat',
    title: 'Display Format',
    required: false,
    Editor: radioEditorForDefinitions(DISPLAY_FORMATS, DISPLAY_FORMATS[1].value)
  })
]);
