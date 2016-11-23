import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import torqueAndDragBroomstick from './widgets/torqueAndDragBroomstick';
import pages from './pages';

export default combineReducers({
  routing: routerReducer,
  [pages.constants.NAME]: pages.reducer,
  [torqueAndDragBroomstick.constants.NAME]: torqueAndDragBroomstick.reducer
});
