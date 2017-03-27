export const SUPPORTED_TRACES = [
  {trace: 'weight_on_bit', label: 'Weight on Bit', unit: 'k{u}m', unitType: 'mass', cunit: 'lb', min: 0, max: 150},
  {trace: 'hook_load', label: 'Hookload', unit: 'k{u}m', unitType: 'mass', cunit: 'lb', min: 0, max: 250},
  {trace: 'rotary_rpm', label: 'RPM', unit: 'rpm', min: 0, max: 150},
  {trace: 'rotary_torque', label: 'Rotary Torque', unit: 'k{u}', unitType: 'force', cunit: 'lbf', min: 0, max: 50},
  {trace: 'rop', label: 'ROP', unit: '{u}-hr', unitType: 'length', cunit: 'ft', min: 0, max: 500},
  {trace: 'rop_average', label: 'ROP (Avg)', unit: '{u}-hr', unitType: 'length', cunit: 'ft', min: 0, max: 500},
  {trace: 'mud_flow_in', label: 'Flow In', unit: '{u}pm', unitType: 'volume', cunit: 'gal', min: 0, max: 1000},
  {trace: 'mud_flow_out', label: 'Flow Out', unit: '{u}pm', unitType: 'volume', cunit: 'gal', min: 0, max: 1000},
  {trace: 'mud_flow_out_percentage', label: 'Flow Out %', unit: '%', min: 0, max: 100},
  {trace: 'standpipe_pressure', label: 'Standpipe Pressure', unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'pump_spm_total', label: 'SPM', unit: 'spm', min: 0, max: 250},
  {trace: 'mud_volume', label: 'MV', unit: 'bbl', min: 0, max: 1000},
  {trace: 'diff_press', label: 'Diff Press', unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 1000},
  {trace: 'block_height', label: 'BH', unit: '{u}', unitType: 'length', cunit: 'ft', min: 0, max: 100}
];

export const SUPPORTED_TIME_PERIODS = [
  {period: 2, label: '2 hours'},
  {period: 3, label: '3 hours'},
  {period: 4, label: '4 hours'}
];
export const DEFAULT_TIME_PERIOD = 2;
