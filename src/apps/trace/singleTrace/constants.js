export const CATEGORY = 'trace';
export const NAME = 'singleTrace';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  {provider: 'corva', collection: 'wits.summary-1m', params: {limit: 240, behavior: "turnover"}}
];
export const METADATA = {
  settingsTitle: 'Single Trace',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};
export const SUPPORTED_CHART_SERIES = {trace: {label: '', defaultColor: '#24baea'}};
