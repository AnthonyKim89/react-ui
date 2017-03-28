export const CATEGORY = 'settings';
export const NAME = 'planSurveys';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'tasks.survey-parser', event: 'update'},
  {devKey: 'corva', collection: 'tasks.survey-minimum-curvature', event: 'update'}
];
export const METADATA = {
  title: 'Well Plan',
  settingsTitle: 'Well Plan',
  subTitle: 'Drilling trajectory planned well path',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['well'];
