import { fromJS } from 'immutable';

export const CATEGORY = 'trace';
export const NAME = 'traces';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  //{provider: 'corva', collection: 'wits.summary-30m', params: {limit: 2000, sort: '{timestamp:1}', behavior: "accumulate"}},
  {provider: 'corva', collection: 'wits.summary-1m', params: {limit: 240, sort: '{timestamp:1}', behavior: "accumulate"}},
];
export const METADATA = {
  settingsTitle: 'Corva-Traces',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};

export const DEFAULT_TRACE_GRAPHS = fromJS(new Array(32).fill({trace: '', color: '#ffffff'}));

export const STATE_CATEGORY_MAP = {
  'DrillSlide(Slide mode drilling)': "Drilling Slide",
  'DrillRot(Rotary mode drilling)': "Drilling Rotary",
  'InSlips': "Connection",
  'Unclassified(Circulating)': "Circulating",
  'StaticPump(Circulating)': "Circulating",
  'StaticPumpRot(Circulating&Rot)': "Circulating",
  'Rih(Tripping in)': "Run in Hole",
  'Pooh(Tripping out)': "Run out of Hole",
  'PoohPump(Sliding out)': "Washing Upwards",
  'RihPump(Sliding in)': "Washing Downwards",
  'PoohPumpRot(Reaming out)': "Reaming Upwards",
  'RihPumpRot(Reaming in)': "Reaming Downwards",
  'Unclassified': "Other",
  'UnclassifiedPumpRot': "Other",
  'Static(Off bottom)': "Other",
  'CasingRunning': "Running Casing",
  'CasingTrippingIn': "Casing Trip In",
  'CementingAndWaiting': "Cementing",
};

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
