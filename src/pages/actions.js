import { getWidgetSets } from '../api';
import { push } from 'react-router-redux'
import { dashboards } from './selectors';

export const START_LOAD = 'START_LOAD';
function startLoad() {
  return {type: START_LOAD};
}

export const FINISH_LOAD = 'FINISH_LOAD';
function finishLoad(data) {
  return (dispatch, getState) => {
    dispatch({type: FINISH_LOAD, data});
    const dashboard = dashboards(getState()).first();
    dispatch(push(`/dashboards/${dashboard.get('id')}`));
  };
}

export function start() {
  return async dispatch => {
    dispatch(startLoad());
    dispatch(finishLoad(await getWidgetSets(1))); // TODO: Need userId here.
  };
}