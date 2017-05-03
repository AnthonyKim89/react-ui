export const CATEGORY = 'pdm';
export const NAME = 'overview';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'pdm.overview'}
];
export const METADATA = {
  title: 'PDM Power Output',
  settingsTitle: 'PDM Power Output',
  subtitle: 'PDM output efficiency',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-14T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 11};
export const SUPPORTED_CHART_SERIES = {
  torque: {label: 'Torque', defaultColor: '#f7e47a'}
};
