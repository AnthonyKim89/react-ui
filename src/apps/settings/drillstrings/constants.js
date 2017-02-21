export const CATEGORY = 'settings';
export const NAME = 'drillstrings';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: 'Drillstrings/BHAs',
  settingsTitle: 'Drillstrings/BHAs',
  subtitle: 'Drillstring and Bottom Hole Assembly (BHA) configuration',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['rig'];

export const COMPONENT_FAMILIES = [
  {name: 'bit', type: 'bit'},
  {name: 'drill collar', type: 'drill_collar'},
  {name: 'drill pipe', type: 'drill_pipe'},
  {name: 'heavy weight drill pipe', type: 'heavy_weight_drill_pipe'},
  {name: 'jar', type: 'jar'},
  {name: 'motor', type: 'motor'},
  {name: 'mwd', type: 'mwd'},
  {name: 'spiral drill collar', type: 'spiral_drill_collar'},
  {name: 'stabilizer', type: 'stabilizer'},
  {name: 'sub', type: 'sub'},
  {name: 'tail pipe', type: 'tail_pipe'}
];