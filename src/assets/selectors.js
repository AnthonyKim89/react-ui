import { createSelector } from 'reselect'
import { Map } from 'immutable';
import { isEmpty, trim } from 'lodash';
import { NAME, ASSET_TYPES } from './constants';

export const assets = state => state[NAME];

export const assetList = createSelector(
  assets,
  (_, props) => props.params.assetType,
  (_, props) => trim(props.location.query.search || '').toLowerCase(),
  (_, props) => props.location.query.sortField || 'name',
  (_, props) => props.location.query.sortOrder === 'desc',
  (allAssets, assetTypeCode, search, sortField, reverseSort) => {
    const parentTypes = collectParentAssetTypes(assetTypeCode);
    const assets = allAssets
      .valueSeq()
      .filter(a => a.get('type') === assetTypeCode)
      .filter(a => isEmpty(search) || a.get('name').toLowerCase().indexOf(search) >= 0)
      .map(a => a.set('parents', collectParentAssets(allAssets, a)))
      .sortBy(
        a => a.get(sortField) || a.getIn(['parents', sortField, 'name']),
        makeAssetComparator(reverseSort)
      );
    return Map({assets, parentTypes});
  }
  
);

export const currentAsset = createSelector(
  assets,
  (_, props) => props.params.assetId,
  (assets, assetId) => {
    let asset = assets.get(assetId);
    while (asset && isResolvableAsset(asset)) {
      if (isResolvedAsset(asset)) {
        asset = assets.get(asset.get('activeChildId'));
      } else {
        return null;
      }
    }
    return asset;
  }
);

export function isResolvableAsset(asset) {
  return ASSET_TYPES.get(asset.get('type')).get('isResolvedToActiveChild');
}

export function isResolvedAsset(asset) {
  return asset.has('activeChildId');
}

function collectParentAssetTypes(assetTypeCode) {
  let parentTypes = Map();
  let nextParentCode = assetTypeCode;
  while (ASSET_TYPES.hasIn([nextParentCode, 'parent_type'])) {
    nextParentCode = ASSET_TYPES.getIn([nextParentCode, 'parent_type']);
    parentTypes = parentTypes.set(nextParentCode, ASSET_TYPES.get(nextParentCode));
  }
  return parentTypes;
}

function collectParentAssets(allAssets, asset) {
  let parents = Map();
  let nextParent = asset;
  while (nextParent && nextParent.has('parent_id')) {
    nextParent = allAssets.get(nextParent.get('parent_id'));
    if (nextParent) {
      parents = parents.set(nextParent.get('type'), nextParent);
    }
  }
  return parents;
}

function makeAssetComparator(reverseSort) {
  return (a, b) => {
    if (a === b) {
      return 0;
    } else if (a < b) {
      return reverseSort ? 1 : -1;
    } else if (a > b) {
      return reverseSort ? -1 : 1;
    }
  }
}
