export const CATEGORY = 'torqueAndDrag';
export const NAME = 'frictionFactor';
export const SUBSCRIPTIONS = [{provider: 'corva', collection: 'torque-and-drag.friction-factor'}];
export const METADATA = {
  title: 'Friction Factor',
  settingsTitle: 'Friction Factor',
  subtitle: 'Override automatic borehole friction coefficient',
  recordProvider: 'corva',
  recordCollection:'torque-and-drag.friction-factor-overrides',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 2, h: 10};
