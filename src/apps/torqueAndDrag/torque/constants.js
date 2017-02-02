export const CATEGORY = 'torqueAndDrag';
export const NAME = 'torque';
export const SUBSCRIPTIONS = [
  {appKey: 'corva.torque_and_drag.torque', collection: 'results'}
];
export const METADATA = {
  title: 'Torque Trend',
  settingsTitle: 'Torque Trend',
  subtitle: 'Torque surface to downhole trend',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
export const SUPPORTED_CHART_SERIES = {
  torsional_yield: {label: 'Torsional Yield', defaultColor: '#f7e47a'},
  torque: {label: 'Torque', defaultColor: '#78905f'}
};
