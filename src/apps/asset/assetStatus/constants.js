export const CATEGORY = 'asset';
export const NAME = 'assetStatus';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'asset.status-10m'}
];
export const METADATA = {
  settingsTitle: 'Asset Status',
  fullSize: true,
  disableDisplayAssetName: true,
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-05-08T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
