export const CATEGORY = 'drillingEfficiency';
export const NAME = 'mseHeatmap';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'drilling-efficiency.mse-heatmap'}
];
export const METADATA = {
  title: 'MSE Heatmap',
  settingsTitle: 'MSE Heatmap',
  subtitle: 'Optimal run paramaters for MSE',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-02-23T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
