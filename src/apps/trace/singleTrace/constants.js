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
  {trace: 'hole_depth', label: 'Hole Depth'},
  {trace: 'bit_depth', label: 'Bit Depth'},
  {trace: 'azimuth', label: 'Azimuth'},
  {trace: 'block_height', label: 'Block Height'},
  {trace: 'differential_pressure', label: 'Differential Pressure'},
  {trace: 'flow', label: 'Flow'},
  {trace: 'gamma', label: 'Gamma'},
  {trace: 'hook_load', label: 'Hook Load'},
  {trace: 'inclination', label: 'Inclination'},
  {trace: 'on_bottom_rop', label: 'On Bottom ROP'},
  {trace: 'over_pull', label: 'Over Pull'},
  {trace: 'pump_1_strokes_min', label: 'Pump 1 Strokes/min'},
  {trace: 'pump_2_strokes_min', label: 'Pump 2 Strokes/min'},
  {trace: 'pump_1_total_strokes', label: 'Pump 1 Total Strokes'},
  {trace: 'pump_2_total_strokes', label: 'Pump 2 Total Strokes'},
  {trace: 'pvt_total_mud_gain_loss', label: 'PVT Total Mud Gain/Loss'},
  {trace: 'rate_of_penetration', label: 'Rate Of Penetration'},
  {trace: 'rotary_rpm', label: 'Rotary RPM'},
  {trace: 'rotary_torque', label: 'Rotary Torque'},
  {trace: 'standpipe_pressure', label: 'Standpipe Pressure'},
  {trace: 'surface_stick_slip_index', label: 'Surface Stick Slip Index'},
  {trace: 'tool_face', label: 'Tool Face'},
  {trace: 'total_mud_volume', label: 'Total Mud Volume'},
  {trace: 'total_pump_output', label: 'Total Pump Output'},
  {trace: 'trip_speed', label: 'Trip Speed'},
  {trace: 'weight_on_bit', label: 'Weight on Bit'},
  {trace: 'time_of_penetration', label: 'Time Of Penetration'}
];
export const SUPPORTED_CHART_SERIES = {trace: {label: '', defaultColor: '#24baea'}};
export const SUPPORTED_TIME_PERIODS = [
  {period: 2, label: '2 hours'},
  {period: 3, label: '3 hours'},
  {period: 4, label: '4 hours'}
];
export const DEFAULT_TIME_PERIOD = 2;
