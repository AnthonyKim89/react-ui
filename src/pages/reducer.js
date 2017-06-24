import { Map } from 'immutable';

import * as t from './actions';

const initialState = Map({
  isNative: false,
  isLoading: false,
  dashboards: Map(),
  pageParams: Map()
});

function appsById(apps) {
  return apps.reduce(
    (res, w) => res.set(w.get('id'), w),
    Map()
  );
}

function dashboardsById(dashboards) {
  return dashboards.reduce(
    (res, w) => res.set(w.get('id'), w.update('apps', appsById)),
    Map()
  );
}

function createApp(appType, settings, forAppSet) {
  const y = forAppSet.get('apps').isEmpty() ?
    0 :
    forAppSet.get('apps').map(w => w.getIn(['coordinates', 'y'])).max() + 1;
  const x = 0;
  return Map({
    category: appType.constants.CATEGORY,
    name: appType.constants.NAME,
    coordinates: Object.assign({}, appType.constants.INITIAL_SIZE, {x, y}),
    settings
  });
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true,
        isNative: action.isNative || false
      });
    case t.UPDATE_DASHBOARDS:
      return state.merge({
        isLoading: true,
        isNative: action.isNative || false
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        dashboards: dashboardsById(action.dashboardsList)
      });
    case t.FINISH_RELOAD:
      return state.merge({
        isLoading: false,
        dashboards: dashboardsById(action.dashboardsList)
      });
    case t.SET_PAGE_PARAMS:
      return state.setIn(
        ['pageParams', action.assetId],
        Map(action.params)
      );
    case t.MOVE_APP:
      return state.setIn(
        ['dashboards', action.dashboard.get('id'), 'apps', action.id, 'coordinates'],
        Map(action.coordinates)
      );
    case t.UPDATE_APP_SETTINGS:
      return state.setIn(
        ['dashboards', action.dashboard.get('id'), 'apps', action.id, 'settings'],
        action.settings
      );
    case t.ADD_NEW_APP:
      return state.setIn(
        ['dashboards', action.dashboard.get('id'), 'newApp'],
        createApp(action.appType, action.settings, state.getIn(['dashboards', action.dashboard.get('id')]))
      );
    case t.PERSIST_NEW_APP:
      return state
        .setIn(
          ['dashboards', action.dashboard.get('id'), 'apps', action.app.get('id')],
          action.app
        )
        .deleteIn(['dashboards', action.dashboard.get('id'), 'newApp']);
    case t.REMOVE_APP:
      return state.deleteIn(['dashboards', action.dashboard.get('id'), 'apps', action.id]);
    default:
      return state;
  }
};
