import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import torqueAndDragBroomstick from './widgets/torqueAndDragBroomstick';
import widgets from './widgets';

export default combineReducers({
  routing: routerReducer,
  widgets: widgets.reducer,
  [torqueAndDragBroomstick.constants.NAME]: torqueAndDragBroomstick.reducer
});
