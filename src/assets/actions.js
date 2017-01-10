import { List } from 'immutable';
import { last } from 'lodash';

import * as api from '../api';
import { ASSET_TYPES } from './constants';
import { assets } from './selectors';

export const LOAD_ASSETS = 'LOAD_ASSETS';

export function loadAsset(assetId) {
  return async (dispatch, getState) => {
    const loadedAsset = assets(getState()).get(assetId);
    if (!loadedAsset || (isResolvableAsset(loadedAsset) && !isResolvedAsset(loadedAsset))) {
      let assets = List().push(await api.getAsset(assetId));
      while (isResolvableAsset(assets.last())) {
        const parent = assets.last();
        const child = await api.getActiveChildAsset(parent.get('id'));
        assets = assets
          .butLast()
          .push(parent.set('activeChildId', child.get('id')))
          .push(child);
      }
      dispatch({type: LOAD_ASSETS, assets});
    }
  }
}

export function listAssets(assetType) {
  return async (dispatch, getState) => {
    // Load all parent assets as well, by checking the ancestor asset types of this asset type
    // and loading assets of all those types.
    const assetTypesToResolve = [assetType];
    while (ASSET_TYPES.get(last(assetTypesToResolve)).has('parent_type')) {
      assetTypesToResolve.push(ASSET_TYPES.getIn([last(assetTypesToResolve), 'parent_type']));
    }
    const assets = await api.getAssets(assetTypesToResolve);
    dispatch({type: LOAD_ASSETS, assets});
  }
}

/*
 * Check if an asset should be "resolved" to another active asset.
 * Currently we just check if it's a rig (which has an active well)
 * but a more generic solution would be preferable.
 */
function isResolvableAsset(asset) {
  return asset.get('type') === 'rig';
}
function isResolvedAsset(asset) {
  return asset.has('activeChildId');
}