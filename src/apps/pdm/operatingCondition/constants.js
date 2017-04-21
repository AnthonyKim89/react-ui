export const CATEGORY = 'pdm';
export const NAME = 'operatingCondition';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'pdm.operating-condition'}
];
export const METADATA = {
  title: 'Motor Torque Output',
  settingsTitle: 'Motor Torque Output',
  subtitle: 'PDM output range and limits',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 8, h: 10};

export const SUPPORTED_CHART_SERIES = {
   torque: {
     label: 'Torque',
     defaultColor: '#ff0000',
     type: 'line'
   },
   rpm: {
     label: 'RPM',
     defaultColor: '#add8e6',
     type: 'line'
   }
};
