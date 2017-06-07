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
  {name: 'G105', type: 'G105'},
  {name: 'S135', type: 'S135'},
  {name: 'Z140', type: 'Z140'},
  {name: 'P110', type: 'P110'},
  {name: 'V150', type: 'V150'},
  {name: 'N80',  type: 'N80'},
  {name: 'Q125', type: 'Q125'},
  {name: 'H40', type: 'H40'},
  {name: 'J55', type: 'J55'},
  {name: 'K55', type: 'K55'},
  {name: 'L80', type: 'L80'},
  {name: 'C90',  type: 'C90'},
  {name: 'C95', type: 'C95'},
  {name: 'T95', type: 'T95'},
  {name: 'VM-105 DP LT',  type: 'VM-105 DP LT'},
  {name: 'VM-105 DP MS', type: 'VM-105 DP MS'},
  {name: 'VM-105 DP S', type: 'VM-105 DP S'},
  {name: 'VM-105 DP SS', type: 'VM-105 DP SS'},
  {name: 'VM-105 DP SSE', type: 'VM-105 DP SSE'},
  {name: 'VM-120 DP MS',  type: 'VM-120 DP MS'},
  {name: 'VM-135 DP LT', type: 'VM-135 DP LT'},
  {name: 'VM-140 DP', type: 'VM-140 DP'},
  {name: 'VM-150 DP', type: 'VM-150 DP'},
  {name: 'VM-165 DP', type: 'VM-165 DP'},
  {name: 'VM-95 DP LT', type: 'VM-95 DP LT'},
  {name: 'VM-95 DP S',  type: 'VM-95 DP S'},
  {name: 'VM-95 DP SS', type: 'VM-95 DP SS'},
  {name: 'AISI 4145 H1', type: 'AISI 4145 H1'},
  {name: 'AISI 4145 H2', type: 'AISI 4145 H2'},
  {name: 'AISI 1340', type: 'AISI 1340'}  
];

export const COMPONENT_MATERIALS = [
  {name: 'Steel', type: 'Steel'},
  {name: 'Aluminium', type: 'Aluminium'},
  {name: 'Titanium', type: 'Titanium'}
];

export const COMPONENT_CATALOGUES = [
  {name: 'CATALOGUE1', type: 'catalogue1'},
  {name: 'CATALOGUE1', type: 'catalogue2'}
];

export const DC_SUB_CATEGORIES = [
  {name: 'Steel', type: 'Steel'},
  {name: 'NonMag', type: 'NonMag'},
];

export const JAR_SUB_CATEGORIES = [
  {name: 'Mechanical', type: 'Mechanical'},
  {name: 'Hydraulic', type: 'Hydraulic'}
];

export const DRILLSTRING_DATA_TEMPLATE = Map({components: List()});