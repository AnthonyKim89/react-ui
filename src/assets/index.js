import reducer from './reducer';
import * as constants from './constants';
import * as actions from './actions';
import * as selectors from './selectors';
import AssetStatus from './components/AssetStatus';

export default {
  constants,
  components: {
    AssetStatus
  },
  actions,
  selectors,
  reducer
};