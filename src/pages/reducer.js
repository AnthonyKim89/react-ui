import { List, Map } from 'immutable';
import moment from 'moment';

import * as t from './actions';

const initialState = Map({
  isLoading: true,
  widgetSets: Map(),
  wellTimelines: Map()
});

function widgetsById(widgets) {
  return widgets.reduce(
    (res, w) => res.set(w.get('id'), w),
    Map()
  );
}

function widgetSetsById(widgetSets) {
  return widgetSets.reduce(
    (res, w) => res.set(w.get('id'), w.update('widgets', widgetsById)),
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
    const time = lastTooltipDepth ? moment(lastTooltipDepth.get('entry_at')) : null;
    return timeline.set('currentTime', time);
  }
}

function createWidget(widgetType, forWidgetSet) {
  const y = forWidgetSet.get('widgets').isEmpty() ?
    0 :
    forWidgetSet.get('widgets').map(w => w.getIn(['coordinates', 'y'])).max() + 1;
  const x = 0;
  return Map({
    category: widgetType.constants.CATEGORY,
    name: widgetType.constants.NAME,
    coordinates: Object.assign({}, widgetType.constants.INITIAL_SIZE, {x, y}),
    settings: Map({wellId: 1016})
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
        widgetSets: widgetSetsById(action.widgetSets)
      });
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
    case t.MOVE_WIDGET:
      return state.setIn(
        ['widgetSets', action.widgetSet.get('id'), 'widgets', action.id, 'coordinates'],
        Map(action.coordinates)
      );
    case t.ADD_NEW_WIDGET:
      return state.setIn(
        ['widgetSets', action.widgetSet.get('id'), 'newWidget'],
        createWidget(action.widgetType, state.getIn(['widgetSets', action.widgetSet.get('id')]))
      );
    case t.PERSIST_NEW_WIDGET:
      return state
        .setIn(
          ['widgetSets', action.widgetSet.get('id'), 'widgets', action.widget.get('id')],
          action.widget
        )
        .deleteIn(['widgetSets', action.widgetSet.get('id'), 'newWidget']);
    default:
      return state;
  }
};
