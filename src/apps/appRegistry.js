import { List, Map } from 'immutable';
import torqueAndDragBroomstick from './torqueAndDragBroomstick';
import axialLoad from './axialLoad';
import stress from './stress';
import wellTimeline from './wellTimeline';

// Apps that can be displayed on dashboard / asset pages, keyed by app type
export const uiApps = Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    subtitle: 'Downhole torque and drag',
    appTypes: Map({
      broomstick: torqueAndDragBroomstick,
      axialLoad: axialLoad,
      stress: stress
    })
  }),
});

// Apps that are used as control UIs on asset pages, keyed by asset type
export const controlApps = Map({
  well: List([wellTimeline])
});
