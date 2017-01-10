import { fromJS } from 'immutable';

export const NAME = 'assets';
export const ASSET_TYPES = fromJS({
  well: {labelSingular: 'Well', labelPlural: 'Wells', parent_type: 'rig'},
  rig: {labelSingular: 'Rig', labelPlural: 'Rigs', parent_type: 'program'},
  program: {labelSingular: 'Program', labelPlural: 'Programs'}
});