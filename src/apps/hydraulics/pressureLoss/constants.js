export const CATEGORY = 'hydraulics';
export const NAME = 'pressureLoss';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'rig-activity.rig-activity'}
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
