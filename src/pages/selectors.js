import { createSelector } from 'reselect';
import { List, Map } from 'immutable';

import { NAME } from './constants';
import assets from '../assets';

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

export const isLoading = createSelector(
  stateSelector,
  state => state.get('isLoading')
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

export const currentPageParams = createSelector(
  pageParams,
  (_, props) => props.params.assetId,
  (allParams, assetId) => allParams.get(assetId)
);

export const dashboardAppAssets = createSelector(
  assets.selectors.assets,
  currentDashboard,
  (allAssets, dashboard = Map()) => Map(
    dashboard
      .get('apps', List())
      .map(app => {
        let asset = allAssets.get(app.getIn(['settings', 'assetId']));
        while (asset && asset.has('activeChildId')) {
          asset = allAssets.get(asset.get('activeChildId'));
        }
        return asset;
      })
  )
);