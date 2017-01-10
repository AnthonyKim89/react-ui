import { Map } from 'immutable';

import * as t from './actions';

// The state for this reducer is an identity map of assets: asset id -> asset
const initialState = Map({});

function addAssets(assets, newAssets) {
  return newAssets.reduce(
    (result, asset) => result.set(asset.get('id'), asset),
    assets
  );
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.LOAD_ASSETS:
      return addAssets(state, action.assets);
    default:
      return state;
  }
};
