import { createSelector } from 'reselect'
import { List, Map } from 'immutable';
import { isEmpty, trim } from 'lodash';
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

export const assets = createSelector(
  stateSelector,
  state => state.get('assets')
);

export const assetList = createSelector(
  assets,
  (_, props) => props.params.assetType,
  (_, props) => trim(props.location.query.search || '').toLowerCase(),
  (_, props) => props.location.query.sortField || 'name',
  (_, props) => props.location.query.sortOrder === 'desc',
  (assets, assetType, search, sortField, reverseSort) => assets
    .valueSeq()
    .filter(a => a.get('type') === assetType)
    .filter(a => isEmpty(search) || a.get('name').toLowerCase().indexOf(search) >= 0)
    .sortBy(
      a => a.get(sortField),
      (a, b) => {
        if (a === b) {
          return 0;
        } else if (a < b) {
          return reverseSort ? 1 : -1;
        } else if (a > b) {
          return reverseSort ? -1 : 1;
        }
      })
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
  (_, props) => parseInt(props.params.assetId, 10),
  (allParams, assetId) => allParams.get(assetId)
);

export const currentAsset = createSelector(
  assets,
  (_, props) => parseInt(props.params.assetId, 10),
  (assets, assetId) => assets.get(assetId)
);

export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);

export const dashboardAppAssets = createSelector(
  assets,
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