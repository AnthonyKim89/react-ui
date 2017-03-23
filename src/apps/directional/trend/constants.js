export const CATEGORY = 'directional';
export const NAME = 'trend';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'directional.trend'}
];
export const METADATA = {
  title: 'Directional Trend',
  settingsTitle: 'Directional Trend',
  subtitle: 'This is directional trend app',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-03-13T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 9, h: 10};
export const SUPPORTED_CHART_SERIES = {
	 tfo: {label:'GTF', defaultColor:'#add8e6', type:'scatter'},
	 tvd_actual: {label:'Well Path', defaultColor:'#00ff00', type:'line'},
	 tvd_plan: {label:'Planned Well Path', defaultColor:'#ff0000', type:'line'},
	 drilling_window: {label:'Drilling Window', defaultColor:'rgba(255,255,0,0.5)', type:'arearange'},
	 dls: {label:'DLS', defaultColor:'#0000ff', type:'line'}
	 
};