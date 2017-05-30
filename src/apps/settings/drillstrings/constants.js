import { List, Map } from 'immutable';

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
export const SUPPORTED_ASSET_TYPES = ['well'];

export const COMPONENT_FAMILIES = [
  {name: 'DP', type: 'dp'},
  {name: 'HWDP', type: 'hwdp'},
  {name: 'Bit', type: 'bit'},
  {name: 'DC', type: 'dc'},    
  {name: 'Jar', type: 'jar'},
  {name: 'PDM', type: 'pdm'},
  {name: 'MWD', type: 'mwd'},
  {name: 'Spiral drill collar', type: 'spiral_drill_collar'},
  {name: 'Stabilizer', type: 'stabilizer'},
  {name: 'Sub', type: 'sub'},
  {name: 'Tail pipe', type: 'tail_pipe'}
];

export const COMPONENT_GRADES = [
  {name: 'G105', type: 'g105'},
  {name: 'S135', type: 's135'}
];

export const COMPONENT_MATERIALS = [
  {name: 'STEEL', type: 'steel'},
  {name: 'ALUMINUM', type: 'aluminum'}
];

export const COMPONENT_CATALOGUES = [
  {name: 'CATALOGUE1', type: 'catalogue1'},
  {name: 'CATALOGUE1', type: 'catalogue2'}
];


export const DRILLSTRING_DATA_TEMPLATE = Map({components: List()});