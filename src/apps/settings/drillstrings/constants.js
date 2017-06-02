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
  {name: 'Stabilizer', type: 'stabilizer'},
  {name: 'Sub', type: 'sub'},
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

export const HWDP_SUB_CATEGORIES = [
  {name: 'HWDP_SUB_1', type: 'hwdp_sub_1'},
  {name: 'HWDP_SUB_2', type: 'hwdp_sub_2'},
  {name: 'HWDP_SUB_3', type: 'hwdp_sub_3'},
];

export const DC_SUB_CATEGORIES = [
  {name: 'Spiral DC', type: 'sprial_dc'}  
];

export const JAR_SUB_CATEGORIES = [
  {name: 'JAR SUB 1', type: 'jar_sub_1'}  
];


export const DRILLSTRING_DATA_TEMPLATE = Map({components: List()});