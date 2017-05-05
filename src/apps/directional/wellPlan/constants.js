export const CATEGORY = 'directional';
export const NAME = 'wellPlan';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: 'Directional Well Plan',
  settingsTitle: 'Directional Well Plan',
  subtitle: 'Directinal accuracy vs well plan',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-15T00:00:00',
  provider: 'corva',
  collections: [
    'data.actual_survey',
    'data.plan_survey'
  ]
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const SUPPORTED_CHART_SERIES = {	 
	 plan: {label: 'Plan', defaultColor: '#add8e6', chartType: 'line'},
   actual: {label: 'Actual', defaultColor: '#ff0000', chartType: 'line'}
};

export const GRAPH_TYPES = [
  {type: 1, title:'Tvd vs Vertical Section'},
  {type: 2, title:'Northing vs Easting'}
];