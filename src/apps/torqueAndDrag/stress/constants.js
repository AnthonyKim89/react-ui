export const CATEGORY = 'torqueAndDrag';
export const NAME = 'stress';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'torque-and-drag.stress'}
];
export const METADATA = {
  title: 'Stress',
  settingsTitle: 'Stress',
  subtitle: 'Stresses applied to drillstring',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
export const SUPPORTED_CHART_SERIES = {
  von_mises_stress: {label: 'von Mises stress', defaultColor: '#24baea', unitType: 'force', unit: 'klbf'},
  twist_stress: {label: 'Twist Stress', defaultColor: '#78905f', unitType: 'torque', unit: 'ft-klbf'},
  axial_stress: {label: 'Axial Stress', defaultColor: '#5f7f90', unitType: 'force', unit: 'klbf'},
  yield_stress_60_percent: {label: 'Yield Stress 60%', defaultColor: '#fffa6c', unitType: 'force', unit: 'klbf'},
  yield_stress_80_percent: {label: 'Yield Stress 80%', defaultColor: '#ffd200', unitType: 'force', unit: 'klbf'},
  yield_stress: {label: 'Yield Stress', defaultColor: '#ff0000', unitType: 'force', unit: 'klbf'},
  bending_stress: {label: 'Bending Stress', defaultColor: '#24baea', unitType: 'force', unit: 'klbf'}
};
