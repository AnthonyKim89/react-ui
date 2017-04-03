export const CATEGORY = 'drillingEfficiency';
export const NAME = 'optimization';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'drilling-efficiency.optimization'},
  {provider: 'corva', collection: 'wits'}
];
export const METADATA = {
  title: 'Drilling Recommendations',
  settingsTitle: 'Optimization',
  subtitle: 'Satistical calculation of drilling recommendations',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-7T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
