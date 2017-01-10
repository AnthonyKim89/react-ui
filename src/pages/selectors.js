import { createSelector } from 'reselect'
import { List, Map } from 'immutable';
import { isEmpty, trim } from 'lodash';
import { NAME, ASSET_TYPES } from './constants';

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
  (allAssets, assetType, search, sortField, reverseSort) => {
    let parentTypes = Map();
    let nextParent = assetType;
    while (ASSET_TYPES.hasIn([nextParent, 'parent_type'])) {
      nextParent = ASSET_TYPES.getIn([nextParent, 'parent_type']);
      parentTypes = parentTypes.set(nextParent, ASSET_TYPES.get(nextParent));
    }
    const assets = allAssets
      .valueSeq()
      .filter(a => a.get('type') === assetType)
      .filter(a => isEmpty(search) || a.get('name').toLowerCase().indexOf(search) >= 0)
      .map(a => {
        let parents = Map();
        let nextParent = a;
        while (nextParent && nextParent.has('parent_id')) {
          nextParent = allAssets.get(nextParent.get('parent_id'));
          parents = parents.set(nextParent.get('type'), nextParent);
        }
        return a.set('parents', parents);
      })
      .sortBy(
        a => a.get(sortField) || a.getIn(['parents', sortField, 'name']),
        (a, b) => {
          if (a === b) {
            return 0;
          } else if (a < b) {
            return reverseSort ? 1 : -1;
          } else if (a > b) {
            return reverseSort ? -1 : 1;
          }
        });
    return Map({assets, parentTypes});
  }
  
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

export const currentAsset = createSelector(
  assets,
  (_, props) => props.params.assetId,
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