export const CATEGORY = 'hydraulics';
export const NAME = 'bedHeight';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'hydraulics.cuttings-transport'}
];
export const METADATA = {
  title: 'Cuttings Bed Height',
  settingsTitle: 'Cuttings Bed Height',
  subtitle: 'The cuttings bed height at each depth',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 11};
export const SUPPORTED_CHART_SERIES = {
  bedHeight: {label: 'Bed Height', defaultColor: '#add8e6'}
};
