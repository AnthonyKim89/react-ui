export const CATEGORY = 'torqueAndDrag';
export const NAME = 'stress';
export const METADATA = {
  title: 'Stress',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
export const SUPPORTED_CHART_SERIES = {
  von_mises_stress: {label: 'von Mises stress', defaultColor: '#f7e47a'},
  twist_stress: {label: 'Twist Stress', defaultColor: '#78905f'},
  axial_stress: {label: 'Axial Stress', defaultColor: '#5f7f90'},
  measured_depth: {label: 'Measured Depth', defaultColor: '#24baea'},
  yield_stress_60_percent: {label: 'Yield Stress 60%', defaultColor: '#f7e47a'},
  yield_stress_80_percent: {label: 'Yield Stress 80%', defaultColor: '#78905f'},
  yield_stress: {label: 'Yield Stress', defaultColor: '#5f7f90'},
  bending_stress: {label: 'Bending Stress', defaultColor: '#24baea'}
};
