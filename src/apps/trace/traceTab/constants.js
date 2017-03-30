import { List } from 'immutable';

export const CATEGORY = 'trace';
export const NAME = 'traceTab';
export const SUBSCRIPTIONS = [
  {devKey: 'corva', collection: 'wits'},
  {devKey: 'corva', collection: 'wits-summary-30s', params: {initial: 240, behavior: "turnover"}}
];
export const METADATA = {
  settingsTitle: 'Trace Tab',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00',
  isHiddenFromAddApp: true
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};

export const DEFAULT_TRACE_GRAPHS = List.of(
  'weight_on_bit',
  'hook_load',
  'rotary_rpm',
  'rotary_torque',
  'rop',
  'rop_average',
  'mud_flow_in',
  'mud_flow_out',
  'mud_flow_out_percentage',
  'standpipe_pressure',
  'pump_spm_total'
);
