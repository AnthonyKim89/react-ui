import { fromJS } from 'immutable';

export const CATEGORY = 'trace';
export const NAME = 'traces';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  {provider: 'corva', collection: 'wits.summary-1m', params: {limit: 240, behavior: "turnover"}}
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

export const DEFAULT_TRACE_GRAPHS = fromJS([
  {trace: 'weight_on_bit', color: '#24baea'},
  {trace: 'hook_load', color: '#f7e47a'},
  {trace: 'rotary_rpm', color: '#78905f'},
  {trace: 'rotary_torque', color: '#24baea'},
  {trace: 'rop', color: '#f7e47a'},
  {trace: 'rop_average', color: '#78905f'},
  {trace: 'mud_flow_out_percentage', color: '#24baea'},
  {trace: 'standpipe_pressure', color: '#f7e47a'},
  {trace: 'pump_spm_total', color: '#78905f'},
  {trace: 'hole_depth', color: '#24baea'},
  {trace: 'bit_depth', color: '#f7e47a'},
]);
