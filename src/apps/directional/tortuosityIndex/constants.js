export const CATEGORY = 'directional';
export const NAME = 'tortuosityIndex';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'data.actual_survey'}
];
export const METADATA = {
  title: 'Dogleg Severity',
  settingsTitle: 'Dogleg Severity',
  subtitle: 'Dogleg severity over MD indicating tortuous path',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-14T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 10};
export const DEFAULT_LIMIT = 15;
export const SUPPORTED_CHART_SERIES = {
	 dls: {label:'Dogleg Severity', defaultColor:'#ee792f'} 
};