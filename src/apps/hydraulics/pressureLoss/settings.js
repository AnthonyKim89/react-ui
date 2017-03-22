import { List, Map } from 'immutable';

import { radioEditorForDefinitions } from '../../../common/RadioEditor';
import { DISPLAY_FORMATS } from './constants';

export default List([
  Map({
    name: 'displayFormat',
    title: '',
    required: false,
    default: DISPLAY_FORMATS[0].value,
    Editor: radioEditorForDefinitions(DISPLAY_FORMATS)
  })
]);
