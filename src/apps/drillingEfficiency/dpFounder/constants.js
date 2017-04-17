export const CATEGORY = 'drillingEfficiency';
export const NAME = 'dpFounder';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'drilling-efficiency.dp-founder'}
];
export const METADATA = {
  title: 'Diff Press Founder Point',
  settingsTitle: 'Diff Press Founder Point',
  subtitle: 'Linear Relationship of Diff Press Increase',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-02-23T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const SUPPORTED_CHART_SERIES = {
  rop: {label: 'ROP', defaultColor: '#fff', unitType: 'length', unit: 'ft'},
};
