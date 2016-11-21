import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

async function get(path, queryParams = {}) {
  const qry = queryString(queryParams);
  const response = await fetch(`${path}${qry ? '?' : ''}${qry}`, {
    credentials: 'same-origin' // This will include cookies in the request, for authentication.
  });
  return fromJS(await response.json());
}

export async function getWidgetSets(userId) {
  const data = await get(`/api/widget_sets/${userId}`);
  return fromJS(data);
}

export async function getTorque({wellId, date}) {
  const queryParams = {date: date.unix()};
  const data = await get(`/api/jobs/${wellId}/torque_and_drag/broomstick_chart`, queryParams);
  return fromJS(data);
}
