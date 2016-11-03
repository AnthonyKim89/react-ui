import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

async function get(path, queryParams) {
  const response = await fetch(`${path}?${queryString(queryParams)}`, {
    credentials: 'same-origin' // This will include cookies in the request, for authentication.
  });
  return fromJS(await response.json());
}

export async function getTorque({jobId, date, zoom, uuid, interval, step}) {
  const queryParams = {date, zoom, uuid, interval, step, torque: 1};
  const data = await get(`/jobs/${jobId}/drill_view`, queryParams);
  return data.get('torque');
}
