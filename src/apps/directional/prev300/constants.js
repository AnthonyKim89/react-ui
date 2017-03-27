export const CATEGORY = 'directional';
export const NAME = 'prev300';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'directional.prev300'}
];
export const METADATA = {
  title: 'Prev 300ft',
  settingsTitle: 'Prev 300ft',
  subtitle: 'Prev 300ft',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-15T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const SUPPORTED_CHART_SERIES = {
	 actual: {label: 'Actual', defaultColor: '#ff0000', chartType: 'scatter'},
	 plan: {label: 'Plan', defaultColor: '#add8e6', chartType: 'line'},
};