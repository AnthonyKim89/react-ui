export const CATEGORY = 'drillingEfficiency';
export const NAME = 'wobFounder';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'drilling-efficiency.wob-founder'}
];
export const METADATA = {
  title: 'WOB Founder Point',
  settingsTitle: 'WOB Founder Point',
  subtitle: 'Linear Relationship of WOB Increase',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-02-23T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const SUPPORTED_CHART_SERIES = {
  rop: {label: 'ROP', defaultColor: '#fff', unitType: 'length', unit: 'ft'},
};
