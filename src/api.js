import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

async function request(path, config = {}) {
  config = Object.assign({
    credentials: 'same-origin' // This will include cookies in the request, for authentication.
  }, config);
  const response = await fetch(path, config);
  return fromJS(await response.json());
}

async function get(path, queryParams = {}) {
  const qry = queryString(queryParams);
  return await request(`${path}${qry ? '?' : ''}${qry}`);
}

async function put(path, content) {
  return await request(path, {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(content)
  });
}


export async function getCurrentUser() {
  return fromJS(await get(`/api/users/current`));
}

export async function getWidgetSets(userId) {
  const data = await get(`/api/users/${userId}/widget_sets`);
  return fromJS(data);
}

export async function updateWidget(userId, widgetSetId, widget) {
  return await put(
    `/api/users/${userId}/widget_sets/${widgetSetId}/widgets/${widget.get('id')}`,
    widget.toJS()
  );
}

export async function getWellTimeline(wellId) {
  const data = await get(`/api/jobs/${wellId}/drill_view/timeline_slider`);
  return fromJS(data);
}

export async function getTorque({wellId, date}) {
  const queryParams = {date: date.unix()};
  const data = await get(`/api/jobs/${wellId}/torque_and_drag/broomstick_chart`, queryParams);
  return fromJS(data);
}
