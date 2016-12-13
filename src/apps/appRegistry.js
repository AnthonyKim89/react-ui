import { Map } from 'immutable';
import torqueAndDragBroomstick from './torqueAndDragBroomstick';

export default Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    subtitle: 'Downhole torque and drag',
    appTypes: Map({
      broomstick: torqueAndDragBroomstick
    })
  })
});
