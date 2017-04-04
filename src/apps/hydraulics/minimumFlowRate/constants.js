export const CATEGORY = 'hydraulics';
export const NAME = 'minimumFlowRate';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'torque-and-drag.broomstick'}
];
export const METADATA = {
  title: 'Required Minimum Flow Rate',
  settingsTitle: 'Required Minimum Flow Rate',
  subtitle: 'The flow rate required at each depth',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 11};
export const SUPPORTED_CHART_SERIES = {
  rotary_off_bottom: {label: 'Rotating', defaultColor: '#f7e47a'},
  pick_up: {label: 'Pickup', defaultColor: '#78905f'},
  slack_off: {label: 'Slackoff', defaultColor: '#5f7f90'}
};
