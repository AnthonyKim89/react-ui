export const CATEGORY = 'analytics';
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
  collections: {
    30: 'metrics.rop-1d',
    1: 'metrics.rop-1h'
  }
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
    label: 'Last 24 hours',
    value: 1
  }
];
export const SUPPORTED_CHART_SERIES = {
  total: {
     label: 'Total',
     defaultColor: '#d236ba',
     type: 'line'
   },
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
    label: 'Gross',
    value: 'gross'
  },
  {
    label: 'On Bottom',
    value: 'on_bottom'
  },
  {
    label: 'Rotary',
    value: 'rotary'
  },
  {
    label: 'Slide',
    value: 'slide'
  }
];