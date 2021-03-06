export const CATEGORY = 'torqueAndDrag';
export const NAME = 'broomstick';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'torque-and-drag.hookload-trend'}
];
export const METADATA = {
  title: 'Hookload Trend Broomstick',
  settingsTitle: 'Hookload Trend Broomstick',
  subtitle: 'Visual hookload trend identification for hole problems or poor cleaning',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 15};
export const SUPPORTED_CHART_SERIES = {
  rotary_off_bottom: {label: 'Rotating', defaultColor: '#f7e47a'},
  pick_up: {label: 'Pickup', defaultColor: '#78905f'},
  slack_off: {label: 'Slackoff', defaultColor: '#5f7f90'}
};
