export const CATEGORY = 'directional';
export const NAME = 'wellPlan';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'directional.well-plan'}
];
export const METADATA = {
  title: 'Directional Well Plan',
  settingsTitle: 'Directional Well Plan',
  subtitle: 'Directinal accuracy vs well plan',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-15T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const SUPPORTED_CHART_SERIES = {
	 actual: {label: 'Actual', defaultColor: '#ff0000', chartType: 'line'},
	 plan: {label: 'Plan', defaultColor: '#add8e6', chartType: 'line'},
};