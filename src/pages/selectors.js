import { createSelector } from 'reselect'
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const currentUser = createSelector(
  stateSelector,
  state => state.get('currentUser')
);

export const allWidgetSets = createSelector(
  stateSelector,
  state => state.get('widgetSets')
);

export const dashboards = createSelector(
  stateSelector,
  state => state.get('widgetSets')
    .valueSeq()
    .filter(w => w.get('type') === 'dashboard')
);

export const wellPages = createSelector(
  stateSelector,
  state => state.get('widgetSets')
    .valueSeq()
    .filter(w => w.get('type') === 'well_page')
);

export const wellTimelines = createSelector(
  stateSelector,
  state => state.get('wellTimelines')
);

export const currentDashboard = createSelector(
  dashboards,
  (_, props) => parseInt(props.params.dashboardId, 10),
  (dashboards, dashboardId) => dashboards.find(db => db.get('id') === dashboardId)
);

export const currentWellPage = createSelector(
  wellPages,
  (_, props) => props.params.category,
  (wellPages, category) => wellPages.find(p => p.get('category') === category)
);

export const currentWellTimeline = createSelector(
  wellTimelines,
  (_, props) => parseInt(props.params.wellId, 10),
  (timelines, wellId) => timelines.get(wellId)
);

