export const CATEGORY = 'torqueAndDrag';
export const NAME = 'axialLoad';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'torque-and-drag.axial-load'}
];
export const METADATA = {
  title: 'Axial Load',
  settingsTitle: 'Axial Load',
  subtitle: 'Buckling forces applied to drillstring',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
export const SUPPORTED_CHART_SERIES = {
  helical_buckling_force: {label: 'Helical buckling force', defaultColor: '#ff0000', unitType: 'force', unit: 'klbf'},
  sinusoidal_buckling_force: {label: 'Sinusoidal buckling force', defaultColor: '#ffd200', unitType: 'force', unit: 'klbf'},
  axial_load: {label: 'Axial load', defaultColor: '#24baea', unitType: 'force', unit: 'klbf'}
};