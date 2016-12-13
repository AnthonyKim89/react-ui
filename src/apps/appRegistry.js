import { Map } from 'immutable';
import torqueAndDragBroomstick from './torqueAndDragBroomstick';

export default Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    appTypes: Map({
      broomstick: torqueAndDragBroomstick
    })
  })
});