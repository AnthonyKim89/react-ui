import { combineReducers } from 'redux';

import torqueAndDragBroomstick from './widget/torqueAndDragBroomstick';

export default combineReducers({
  [torqueAndDragBroomstick.constants.NAME]: torqueAndDragBroomstick.reducer
});
