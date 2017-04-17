export const CATEGORY = 'hydraulics';
export const NAME = 'concentration';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'hydraulics.cuttings-transport'}
];
export const METADATA = {
  title: 'Cuttings Transport Concentration',
  settingsTitle: 'Cuttings Transport Concentration',
  subtitle: 'The cuttings transport concentration at each depth',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 11};
export const SUPPORTED_CHART_SERIES = {
  concentration: {label: 'Concentration', defaultColor: '#add8e6'}
};
