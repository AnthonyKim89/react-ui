export const CATEGORY = 'rigActivity';
export const NAME = 'ropPerformance';
export const SUBSCRIPTIONS = [];
export const METADATA = {
  title: 'ROP Performance',
  settingsTitle: 'ROP Performance',
  subtitle: 'Rig ROP performance over time',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  provider: 'corva',
  collection: 'metrics.rop-1d'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 6, h: 5};
export const TARGET = 80;
export const PERIOD_TYPES = [
  {
    label: 'Last 30 days',
    value: 30
  },
  {
    label: 'Last 60 days',
    value: 60
  },
  {
    label: 'Last year',
    value: 360
  }
];
export const SUPPORTED_CHART_SERIES = {
   day: {
     label: 'Day',
     defaultColor: '#6bc2fc',
     type: 'line'
   },
   night: {
     label: 'Night',
     defaultColor: '#6f57ee',
     type: 'line'
   }
};
export const ROP_TYPES = [
  {
    label: 'Total ROP',
    value: 'total_rop'
  },
  {
    label: 'Drilling ROP',
    value: 'drilling_rop'
  }
];