import { getTorque } from '../../api';

export const START_LOAD = 'tadBroomstick/START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'tadBroomstick/FINISH_LOAD';
function finishLoad(data) {
  return {type: FINISH_LOAD, data};
}

export function load(jobId, date) {
  return async dispatch => {
    dispatch(startLoad());
    const data = await getTorque({
      jobId,
      date,
      zoom: 120,
      uuid: 2,
      interval: 60,
      step: 12
    });
    dispatch(finishLoad(data));
  };
}