export const CATEGORY = 'hydraulics';
export const NAME = 'pressureLoss';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'hydraulics.pressure-loss'}
];
export const METADATA = {
  title: 'Pressure Loss',
  settingsTitle: 'Pressure Loss',
  subtitle: 'Pressure loss through system',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};

export const PIE_OPTIONS = {
  // Changes the pie into a donut. Yum.
  innerSize: '33%',
  // Set to 90% to avoid clipping the hover effect.
  size: '90%'
};

export const LABELS = {
  annulus_cased: 'Annulus Cased',
  annulus_openhole: 'Annulus Openhole',
  bit: 'Bit',
  inside_drillstring: 'Inside Drillstring',
  pdm: 'PDM',
  surface_tools: 'Surface Tools'
};

export const COLORS = {
  annulus_cased: '#0085e3',
  annulus_openhole: '#4840d1',
  bit: '#909f98',
  inside_drillstring: '#9500b7',
  pdm: '#f70000',
  surface_tools: '#940000'
};

export const DISPLAY_FORMATS = [
  {
    label: 'Percent(%)',
    value: 'percent'
  },
  {
    label: 'Hour',
    value: 'hour'
  }
];
