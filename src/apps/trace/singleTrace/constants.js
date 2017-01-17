export const CATEGORY = 'trace';
export const NAME = 'singleTrace';
export const SUBSCRIPTIONS = ['wits/raw', 'wits/summary30Seconds'];
export const METADATA = {
  title: 'Single Trace',
  subtitle: '',
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v2.1',
  publishedAt: '2016-07-01T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 5, h: 5};
export const SUPPORTED_TRACES = [
  {trace: 'hole_depth', label: 'Hole Depth', unit: 'ft'},
  {trace: 'bit_depth', label: 'Bit Depth', unit: 'ft'},
  {trace: 'azimuth', label: 'Azimuth', unit: 'degrees'},
  {trace: 'block_height', label: 'Block Height', unit: 'ft'},
  {trace: 'differential_pressure', label: 'Differential Pressure', unit: 'psi'},
  {trace: 'flow', label: 'Flow', unit: 'gpm'},
  {trace: 'gamma', label: 'Gamma', unit: 'gamma'},
  {trace: 'hook_load', label: 'Hook Load', unit: 'klbm'},
  {trace: 'inclination', label: 'Inclination', unit: 'degrees'},
  {trace: 'on_bottom_rop', label: 'On Bottom ROP', unit: 'ft-hr'},
  {trace: 'pump_1_strokes_min', label: 'Pump 1 Strokes/min', unit: 'spm'},
  {trace: 'pump_2_strokes_min', label: 'Pump 2 Strokes/min', unit: 'spm'},
  {trace: 'pump_1_total_strokes', label: 'Pump 1 Total Strokes', unit: 'strokes'},
  {trace: 'pump_2_total_strokes', label: 'Pump 2 Total Strokes', unit: 'strokes'},
  {trace: 'rate_of_penetration', label: 'Rate Of Penetration', unit: 'ft-hr'},
  {trace: 'rotary_rpm', label: 'Rotary RPM', unit: 'rpm'},
  {trace: 'rotary_torque', label: 'Rotary Torque', unit: 'kft-lbf'},
  {trace: 'standpipe_pressure', label: 'Standpipe Pressure', unit: 'psi'},
  {trace: 'tool_face', label: 'Tool Face', unit: 'degrees'},
  {trace: 'total_mud_volume', label: 'Total Mud Volume', unit: 'bbl'},
  {trace: 'weight_on_bit', label: 'Weight on Bit', unit: 'klbm'}
];
export const SUPPORTED_CHART_SERIES = {trace: {label: '', defaultColor: '#24baea'}};
export const SUPPORTED_TIME_PERIODS = [
  {period: 2, label: '2 hours'},
  {period: 3, label: '3 hours'},
  {period: 4, label: '4 hours'}
];
export const DEFAULT_TIME_PERIOD = 2;
