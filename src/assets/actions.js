import { List, Map } from 'immutable';
import { last } from 'lodash';

import * as api from '../api';
import { ASSET_TYPES } from './constants';
import { assets, isResolvableAsset, isResolvedAsset } from './selectors';

export const LOAD_ASSETS = 'LOAD_ASSETS';

export function loadAsset(assetId) {
  return async (dispatch, getState) => {
    const loadedAsset = assets(getState()).get(assetId);
    // Load the ancestry of the asset, and also for any asset that should be resolved to its
    // active child and hasn't yet, do the resolving now.
    // This is done recursively as long as we see resolvable assets.
    if (!loadedAsset || (isResolvableAsset(loadedAsset) && !isResolvedAsset(loadedAsset))) {
      let assets = List().push(await api.getAsset(assetId));
      while (assets.first().get('parent_asset_id')) {
        const parent = await api.getAsset(assets.first().get('parent_asset_id'));
        assets = assets.unshift(parent);
      }
      while (isResolvableAsset(assets.last()) && !isResolvedAsset(assets.last())) {
        const parent = assets.last();
        const child = await api.getActiveChildAsset(parent.get('id'));
        if (child) {
          assets = assets
            .butLast()
            .push(parent.set('activeChildId', child.get('id')))
            .push(child);
        } else {
          assets = assets
            .butLast()
            .push(parent.set('activeChildId', null));
        }
      }
      dispatch({type: LOAD_ASSETS, assets});
    }
  };
}

export function reloadAsset(assetId) {
  return async (dispatch, getState) => {
    const loadedAsset = assets(getState()).get(assetId, Map());
    const refreshedAsset = loadedAsset.merge(await api.getAsset(assetId));
    dispatch({type: LOAD_ASSETS, assets: List.of(refreshedAsset)});
  };
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
  };
}
