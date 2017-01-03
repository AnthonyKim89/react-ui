export const CATEGORY = 'torqueAndDrag';
export const NAME = 'axialLoad';
export const METADATA = {
  title: 'Axial Load',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
export const SUPPORTED_CHART_SERIES = {
  helical_buckling_force: {label: 'Helical buckling force', defaultColor: '#f7e47a'},
  measured_depth: {label: 'Measured Depth', defaultColor: '#78905f'},
  sinusoidal_buckling_force: {label: 'Sinusoidal buckling force', defaultColor: '#5f7f90'},
  axia_load: {label: 'Axial load', defaultColor: '#24baea'}
};