import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

async function get(path, queryParams) {
  const response = await fetch(`${path}?${queryString(queryParams)}`, {
    credentials: 'same-origin' // This will include cookies in the request, for authentication.
  });
  return fromJS(await response.json());
}

export async function getTorque({jobId, date}) {
  const queryParams = {date: date.unix()};
  const data = await get(`/api/jobs/${jobId}/torque_and_drag/broomstick_chart`, queryParams);
  return fromJS(data);
}
