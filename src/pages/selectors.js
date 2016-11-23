import { createSelector } from 'reselect'
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const dashboards = createSelector(
  stateSelector,
  state => state.get('dashboards')
);

export const wellPages = createSelector(
  stateSelector,
  state => state.get('wellPages')
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
