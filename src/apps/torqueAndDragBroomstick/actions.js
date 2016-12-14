import * as api from '../../api';

const TORQUE_OPTIONS = {
  zoom: 120,
  uuid: 2,
  interval: 60,
  step: 12
};

export const START_LOAD = 'tadBroomstick/START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'tadBroomstick/FINISH_LOAD';
function finishLoad(data) {
  return {type: FINISH_LOAD, data};
}

export function load(wellId, date) {
  return async dispatch => {
    dispatch(startLoad());
    const data = await api.getTorque({wellId, date, ...TORQUE_OPTIONS});
    dispatch(finishLoad(data));
  };
}

export function loadForRig(rigId, date) {
  return async dispatch => {
    dispatch(startLoad());
    const rig = await api.getRig(rigId);
    if (rig.get('current_job')) {
      const wellId = rig.getIn(['current_job', 'id']);
      const data = await api.getTorque({wellId, date, ...TORQUE_OPTIONS});
      dispatch(finishLoad(data));
    }
  }
}