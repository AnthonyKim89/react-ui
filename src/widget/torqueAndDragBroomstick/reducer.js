import { Map } from 'immutable';
import * as t from './actions';

const initialState = Map({isLoading: true, data: Map()});

function constructGraphSeries(series) {
  return series.merge({
    seriesType: series.get('type') === 'actual' ? 'scatter' : 'line'
  });
}

function constructGraphData(data) {
  return data.update('series', s => s.map(constructGraphSeries));
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        data: constructGraphData(action.data)
      });
    default:
      return state;
  }
};
