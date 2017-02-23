export const CATEGORY = 'trace';
export const NAME = 'traceTab';
export const SUBSCRIPTIONS = [
  {appKey: 'corva.activity-detector', collection: 'wits'},
  {appKey: 'corva.activity-detector', collection: 'wits-summary-30s', params: {limit: 1440}}
];
export const METADATA = {
  settingsTitle: 'Trace Tab',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};
