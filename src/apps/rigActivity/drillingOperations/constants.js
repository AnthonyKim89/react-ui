export const CATEGORY = 'rigActivity';
export const NAME = 'drillingOperations';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: '',
  settingsTitle: 'Drilling Operations',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  provider: 'corva',
  collections: [
    'operations.summary-2tours',
    'operations.summary-continuous',
    'operations.summary-1w',
    'operations.summary-1m',
    'operations.summary-3m'
  ]
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const DEFAULT_TARGET = 80;
export const PERIOD_TYPES = [
  {
    label: 'Last 2 tours',
    value: 0
  },
  {
    label: 'Continuous',
    value: 1
  }
  // {
  //   label: 'Last Week',
  //   value: 2
  // },
  // {
  //   label: 'Last Month',
  //   value: 3
  // },
  // {
  //   label: 'Last 3 months',
  //   value: 4
  // }
];
export const ACTIVITY_COLORS = {
  'Drilling Slide': '#0085e3',
  'Drilling Rotary': '#4840d1',
  'Connection': '#909f98',
  'Circulating': '#9500b7',
  'Run in Hole': '#f70000',
  'Run out of Hole': '#940000',
  'Reaming Upwards': '#38732e',
  'Reaming Downwards': '#5dd94b',
  'Washing Upwards': '#efd34b',
  'Washing Downwards': '#e99100',
  'Other': '#d2dfd8',
  'Running Casing': '#e837f3',
  'Casing Trip In': '#f8a2fd',
  'Cementing': '#47c7cf'
};
export const SUPPORTED_OPERATIONS = [
  {type: 0, title: 'Tripping In (Connection)', description: ''},
  {type: 1, title: 'Tripping In (Running)', description: ''},
  {type: 2, title: 'Tripping Out (Connection)', description: ''},
  {type: 3, title: 'Tripping Out (Running)', description: ''},
  {type: 4, title: 'Drilling Connection', description: ''},
  {type: 5, title: 'Weight To Weight', description: 'Drilling connection from weight to weight'},
  {type: 6, title: 'Treatment', description: ''},
  {type: 7, title: 'Drilling Joint', description: ''},
  {type: 8, title: 'Running Casing (Setting)', description: ''},
  {type: 9, title: 'Running Casing', description: ''},
  {type: 10, title: 'Cementing', description: ''},
  {type: 11, title: 'Total Casing Time', description: ''},
  {type: 12, title: 'Total Trip Time', description: ''},
  {type: 13, title: 'Full Trip In', description: ''},
  {type: 14, title: 'Full Trip Out', description: ''},
  {type: 15, title: 'Change BHA', description: ''},
  {type: 16, title: 'On Bottom To Slips', description: ''},
  {type: 17, title: 'Slips To On Bottom', description: ''}
];