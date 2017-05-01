export const CATEGORY = 'hydraulics';
export const NAME = 'pressureTrend';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'hydraulics.pressure-trend'}
];
export const METADATA = {
  title: 'Pressure Trend',
  settingsTitle: 'Pressure Trend',
  subtitle: 'Trending pressure, mud weight, and ECD',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 8, h: 10};

export const SUPPORTED_CHART_SERIES = {
   mudWeight: {
     label: 'Mud Weight',
     defaultColor: '#add8e6',
     type: 'line'
   },
   equivalentCirculatingDensity: {
     label: 'ECD',
     defaultColor: '#00ff00',
     type: 'line'
   },
   standpipePressure: {
     label: 'SPP',
     defaultColor: '#ff0000',
     type: 'line'
   },
  mudFlowIn: {
     label: 'Mud Flow In',
     defaultColor: '#5dd0fa',
     type: 'line'
   }
};
