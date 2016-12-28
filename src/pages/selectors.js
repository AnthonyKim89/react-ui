import { createSelector } from 'reselect'
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const allAppSets = createSelector(
  stateSelector,
  state => state.get('appSets')
);

export const dashboards = createSelector(
  stateSelector,
  state => state.get('appSets')
    .valueSeq()
    .filter(w => w.get('type') === 'dashboard')
);

export const isNative = createSelector(
  stateSelector,
  state => state.get('isNative')
);

export const assetPageTabs = createSelector(
  stateSelector,
  state => state.get('appSets')
    .valueSeq()
    .filter(w => w.get('type') === 'asset_page_tab')
);

export const wellTimelines = createSelector(
  stateSelector,
  state => state.get('wellTimelines')
);

export const pageParams = createSelector(
  stateSelector,
  state => state.get('pageParams')
);

export const currentDashboard = createSelector(
  dashboards,
  (_, props) => parseInt(props.params.dashboardId, 10),
  (dashboards, dashboardId) => dashboards.find(db => db.get('id') === dashboardId)
);

export const currentAssetPageTab = createSelector(
  assetPageTabs,
  (_, props) => props.params.category,
  (assetPageTabs, category) => assetPageTabs.find(p => p.get('category') === category)
);

export const currentWellTimeline = createSelector(
  wellTimelines,
  (_, props) => parseInt(props.params.assetId, 10),
  (timelines, assetId) => timelines.get(assetId)
);

export const currentPageParams = createSelector(
  pageParams,
  (_, props) => parseInt(props.params.assetId, 10),
  (allParams, assetId) => allParams.get(assetId)
);


export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);