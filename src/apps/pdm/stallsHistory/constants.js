export const CATEGORY = 'pdm';
export const NAME = 'stallsHistory';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'pdm.stall-detection'}
];
export const METADATA = {
  title: 'Motor Stalls',
  settingsTitle: 'Motor Stalls',
  subtitle: 'Stalling history from previous 24 hours',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-14T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};
