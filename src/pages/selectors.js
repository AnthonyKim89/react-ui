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

export const assetDashboards = createSelector(
  stateSelector,
  state => state.get('appSets')
    .valueSeq()
    .filter(w => w.get('type') === 'asset_dashboard')
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

export const currentAssetDashboards = createSelector(
  assetDashboards,
  (_, props) => props.params.slug,
  (assetDashboards, slug) => assetDashboards.find(p => p.get('slug') === slug)
);

export const currentPageParams = createSelector(
  pageParams,
  (_, props) => parseInt(props.params.assetId, 10),
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