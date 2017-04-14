export const CATEGORY = 'settings';
export const NAME = 'nptEvents';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: 'NPT Events',
  settingsTitle: 'NPT Events',
  subtitle: 'Non-Productive(NPT) events - equipment/critical failures and delays',
  recordProvider: 'corva',
  recordCollection:'data.nptEvents',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2017-03-29T00:00:00',
  isHiddenFromAddApp: true
};

export const SUPPORTED_ASSET_TYPES = ['well'];
