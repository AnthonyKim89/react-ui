import { fromJS } from 'immutable';

export const NAME = 'assets';
export const ASSET_TYPES = fromJS({
  well: {
    labelSingular: 'Well',
    labelPlural: 'Wells',
    parent_type: 'rig',
    hasAssetPage: true,
    isResolvedToActiveChild: false
  },
  rig: {
    labelSingular: 'Rig',
    labelPlural: 'Rigs',
    parent_type: 'program',
    hasAssetPage: false,
    isResolvedToActiveChild: true
  },
  program: {
    labelSingular: 'Program',
    labelPlural: 'Programs',
    hasAssetPage: false,
    isResolvedToActiveChild: false
  }
});
