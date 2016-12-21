import { List, Map } from 'immutable';
import moment from 'moment';

import * as t from './actions';

const initialState = Map({
  isLoading: true,
  appSets: Map(),
  wellTimelines: Map(),
  appData: Map()
});

function appsById(apps) {
  return apps.reduce(
    (res, w) => res.set(w.get('id'), w),
    Map()
  );
}

function appSetsById(appSets) {
  return appSets.reduce(
    (res, w) => res.set(w.get('id'), w.update('apps', appsById)),
    Map()
  );
}

function calculateTimelineActivity(timeline) {
  const jobData = timeline.get('jobData');
  const outOfHoleData = timeline.get('outOfHoleData');
  if (!outOfHoleData.isEmpty()) {
    const firstDate = moment(jobData.get('start_date')).unix() || 0;
    const lastDate = moment(jobData.get('last_date')).unix() || 0;
    const activity = outOfHoleData.map((item, index) => {
      const itemEndTime = moment(item.get('end_time')).unix();
      const itemStartTime = moment(item.get('start_time')).unix();
      let relativeDuration = (itemEndTime - itemStartTime) / (lastDate - firstDate) * 100;
      let relativeStart  = (itemStartTime - firstDate) / (lastDate - firstDate) * 100;
      return Map({
        activity: item.get('activity'),
        relativeStart,
        relativeDuration
      });
    });
    return timeline.set('activity', activity);
  } else {
    return timeline.set('activity', List());
  }
}

function setCurrentTimelineTime(timeline, givenTime) {
  if (givenTime) {
    return timeline.set('currentTime', givenTime);
  } else {
    const lastTooltipDepth = timeline.get('tooltipDepthData').last();
    const time = lastTooltipDepth ? moment(lastTooltipDepth.get('entry_at')) : moment();
    return timeline.set('currentTime', time);
  }
}

function createApp(appType, settings, forAppSet) {
  const y = forAppSet.get('apps').isEmpty() ?
    0 :
    forAppSet.get('apps').map(w => w.getIn(['coordinates', 'y'])).max() + 1;
  const x = 0;
  return Map({
    category: appType.constants.CATEGORY,
    name: appType.constants.NAME,
    coordinates: Object.assign({}, appType.constants.INITIAL_SIZE, {x, y}),
    settings
  });
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        appSets: appSetsById(action.appSets)
      });
    case t.RECEIVE_APP_DATA:
      return state.setIn(['appData', action.appInstanceId], action.data);
    case t.UNSUBSCRIBE_APP:
      return state.removeIn(['appData', action.appInstanceId]);
    case t.LOAD_WELL_TIMELINE:
      return state.setIn(
        ['wellTimelines', action.wellId],
        calculateTimelineActivity(setCurrentTimelineTime(action.timeline, action.drillTime))
      );
    case t.TOGGLE_DRILL_SCROLL_BAR:
      return state.setIn(
        ['wellTimelines', action.wellId, 'scrollBarVisible'],
        action.visible
      );
    case t.SET_DRILL_TIME:
      return state.setIn(
        ['wellTimelines', action.wellId, 'currentTime'],
        action.time
      );
    case t.MOVE_APP:
      return state.setIn(
        ['appSets', action.appSet.get('id'), 'apps', action.id, 'coordinates'],
        Map(action.coordinates)
      );
    case t.UPDATE_APP_SETTINGS:
      return state.setIn(
        ['appSets', action.appSet.get('id'), 'apps', action.id, 'settings'],
        action.settings
      );
    case t.ADD_NEW_APP:
      return state.setIn(
        ['appSets', action.appSet.get('id'), 'newApp'],
        createApp(action.appType, action.settings, state.getIn(['appSets', action.appSet.get('id')]))
      );
    case t.PERSIST_NEW_APP:
      return state
        .setIn(
          ['appSets', action.appSet.get('id'), 'apps', action.app.get('id')],
          action.app
        )
        .deleteIn(['appSets', action.appSet.get('id'), 'newApp']);
    case t.REMOVE_APP:
      return state.deleteIn(['appSets', action.appSet.get('id'), 'apps', action.id]);
    default:
      return state;
  }
};
