export const CATEGORY = 'rigActivity';
export const NAME = 'drillingConnections';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'rig-activity.drilling-connections'}
];
export const METADATA = {
  settingsTitle: '',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};
export const TARGET = 80;
export const PERIOD_TYPES = [
  {
    label: 'Last 2 tours',
    value: 1
  },
  {
    label: 'Continuous',
    value: -1
  },
  {
    label: 'Last Week',
    value: 7
  },
  {
    label: 'Last Month',
    value: 30
  },
  {
    label: 'Last 3 months',
    value: 90
  }
];
export const ACTIVITY_COLORS = {
  'Inslips': '#909f98',
  'Circulating': '#9500b7',
  'Reaming': '#38732e',
  'Washing': '#efd34b'
};
export const SUPPORTED_CONNECTIONS = [
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