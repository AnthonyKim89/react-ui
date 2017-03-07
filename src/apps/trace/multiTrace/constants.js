export const CATEGORY = 'trace';
export const NAME = 'multiTrace';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'data.wits'},
  {devKey: 'corva', collection: 'data.wits-summary-30s', params: {limit: 1440}}
];
export const METADATA = {
  settingsTitle: 'Multi-Trace',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 14};
export const SUPPORTED_CHART_SERIES = {
  trace1: {label: 'Trace 1', defaultColor: '#24baea'},
  trace2: {label: 'Trace 2', defaultColor: '#f7e47a'},
  trace3: {label: 'Trace 3', defaultColor: '#78905f'}
};
