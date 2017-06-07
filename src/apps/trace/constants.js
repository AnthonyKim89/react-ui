export const SUPPORTED_TRACES = [
  {trace: 'weight_on_bit', label: 'Weight on Bit', unit: '{u}', unitType: 'force', cunit: 'klbf', min: 0, max: 150},
  {trace: 'hook_load', label: 'Hookload', unit: '{u}', unitType: 'force', cunit: 'klbf', min: 0, max: 500},
  {trace: 'rotary_rpm', label: 'RPM', unit: 'rpm', min: 0, max: 250},
  {trace: 'rotary_torque', label: 'Rotary Torque', unit: '{u}', unitType: 'torque', cunit: 'ft-klbf', min: 0, max: 50},
  {trace: 'rop', label: 'ROP', unit: '{u}/hr', unitType: 'length', cunit: 'ft', min: 0, max: 500},
  {trace: 'rop_average', label: 'ROP (Avg)', unit: '{u}/hr', unitType: 'length', cunit: 'ft', min: 0, max: 500},
  {trace: 'mud_flow_in', label: 'Flow In', unit: '{u}pm', unitType: 'volume', cunit: 'gal', min: 0, max: 1000},
  {trace: 'mud_flow_out', label: 'Flow Out', unit: '{u}pm', unitType: 'volume', cunit: 'gal', min: 0, max: 1000},
  {trace: 'mud_flow_out_percentage', label: 'Flow Out %', unit: '%', min: 0, max: 100},
  {trace: 'standpipe_pressure', label: 'Standpipe Pressure', unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'pump_spm_total', label: 'SPM', unit: 'spm', min: 0, max: 250},
  {trace: 'mud_volume', label: 'MV', unit: '{u}', unitType: 'oil', cunit: 'bbl', min: 0, max: 1000},
  {trace: 'diff_press', label: 'Diff Press', unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 1000},
  {trace: 'block_height', label: 'BH', unit: '{u}', unitType: 'length', cunit: 'ft', min: 0, max: 100},
  {trace: 'bit_depth', label: 'Bit Depth', unit: '{u}', unitType: 'length', cunit: 'ft'},
  {trace: 'hole_depth', label: 'Hole Depth', unit: '{u}', unitType: 'length', cunit: 'ft'},
];

export const PREDICTED_TRACES = [
  {trace: 'standpipe_pressure', label: 'Standpipe Pressure', collection: 'hydraulics.pressure-loss', path: ['data', 'predicted_standpipe_pressure'], unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'annulus_pressure_loss', label: 'Annulus Pressure Loss', collection: 'hydraulics.pressure-loss', path: ['data', 'predicted_annulus_pressure_loss'], unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'ecd_at_bit', label: 'ECD at Bit', collection: 'hydraulics.pressure-loss', path: ['data', 'predicted_ecd_at_bit'], unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'predicted_ecd_at_casing', label: 'ECD at Casing', collection: 'hydraulics.pressure-loss', path: ['data', 'predicted_ecd_at_casing'], unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 10000},
  {trace: 'recommended_minimum_flowrate', label: 'Minimum Recommended Flowrate', collection: 'hydraulics.overview', path: ['data', 'recommended_minimum_flowrate'], unit: '{u}pm', unitType: 'volume', cunit: 'gal', min: 0, max: 1000},
  {trace: 'hook_load', label: 'Hookload', collection: 'torque-and-drag.predictions', path: ['data', 'predicted_hookload'], unit: '{u}', unitType: 'force', cunit: 'klbf', min: 0, max: 500},
  {trace: 'surface_torque', label: 'Rotary Torque', collection: 'torque-and-drag.predictions', path: ['data', 'predicted_surface_torque'], unit: '{u}', unitType: 'torque', cunit: 'ft-klbf', min: 0, max: 50},
  {trace: 'surface_mse', label: 'Surface MSE', collection: 'torque-and-drag.predictions', path: ['data', 'predicted_surface_mse'], unit: '%', min: 0, max: 100},
  {trace: 'downhole_mse', label: 'Downhole MSE', collection: 'torque-and-drag.predictions', path: ['data', 'predicted_downhole_mse'], unit: '%', min: 0, max: 100},
  {trace: 'diff_press', label: 'Diff Press', collection: 'pdm.operating-condition', path: ['data', 'differential_pressure'], unit: '{u}', unitType: 'pressure', cunit: 'psi', min: 0, max: 1000},
  {trace: 'pdm_rpm', label: 'PDM RPM', collection: 'pdm.operating-condition', path: ['data', 'rpm'], unit: 'rpm', min: 0, max: 250},
  {trace: 'pdm_torque', label: 'PDM Torque', collection: 'pdm.operating-condition', path: ['data', 'pdm_rpm'], unit: '{u}', unitType: 'torque', cunit: 'ft-klbf', min: 0, max: 50},
  {trace: 'total_bit_rpm', label: 'Total Bit RPM', collection: 'pdm.operating-condition', path: ['data', 'total_bit_rpm'], unit: 'rpm', min: 0, max: 250},
  {trace: 'total_bit_torque', label: 'Total Bit Torque', collection: 'pdm.operating-condition', path: ['data', 'total_bit_torque'], unit: '{u}', unitType: 'torque', cunit: 'ft-klbf', min: 0, max: 50},
];

export const SUPPORTED_TIME_PERIODS = [
  {period: 2, label: '2 hours'},
  {period: 3, label: '3 hours'},
  {period: 4, label: '4 hours'}
];
export const DEFAULT_TIME_PERIOD = 2;
