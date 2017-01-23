import { List, Map } from 'immutable';

import broomstick from './torqueAndDrag/broomstick';
import axialLoad from './torqueAndDrag/axialLoad';
import stress from './torqueAndDrag/stress';

import singleTrace from './trace/singleTrace';
import multiTrace from './trace/multiTrace';

import wellTimeline from './wellTimeline';

// Apps that can be displayed on dashboard / asset pages, keyed by app type
export const uiApps = Map({
  torqueAndDrag: Map({
    title: 'Torque & Drag',
    subtitle: 'Downhole torque and drag',
    appTypes: Map({
      broomstick,
      axialLoad,
      stress
    })
  }),
  trace: Map({
    title: 'Trace',
    subtitle: '',
    appTypes: Map({
      singleTrace,
      multiTrace
    })
  })
});

// Apps that are used as control UIs on asset pages, keyed by asset type
export const controlApps = Map({
  well: List([wellTimeline])
});
