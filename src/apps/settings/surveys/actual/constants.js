export const CATEGORY = 'settings';
export const NAME = 'actualSurveys';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'tasks.survey-parser', event: 'update'},
  {provider: 'corva', collection: 'tasks.survey-minimum-curvature', event: 'update'}
];
export const METADATA = {
  title: 'Surveys',
  settingsTitle: 'Surveys',
  subTitle: 'Drilling trajectory actual wellbore path',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['well'];
