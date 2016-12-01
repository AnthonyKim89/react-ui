import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

class APIException {
  
  constructor(status, statusText) {
    this.status = status;
    this.statusText = statusText;
  }

  isAuthenticationProblem() {
    return this.status === 401;
  }

}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

async function request(path, config = {}) {
  config = Object.assign({
    credentials: 'same-origin' // This will include cookies in the request, for authentication.
  }, config);
  const response = await fetch(path, config);
  if (response.ok) {
    return fromJS(await response.json());
  } else {
    throw new APIException(response.status, response.statusText);
  }
}

function isJson(response) {
  const contentType = response.headers.get("content-type");
  return contentType && contentType.indexOf("application/json") !== -1;
}


async function get(path, queryParams = {}) {
  const qry = queryString(queryParams);
  return await request(`${path}${qry ? '?' : ''}${qry}`);
}

async function post(path, content) {
  return await request(path, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(content)
  });
}

async function put(path, content) {
  return await request(path, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(content)
  });
}

async function del(path) {
  return await request(path, {
    method: 'DELETE',
    headers: JSON_HEADERS
  });
}


export async function logIn(email, password) {
  return fromJS(await post('/sessions', {session: {email, password}}));
}

export async function logOut() {
  return await del('/signout');
}

export async function getCurrentUser() {
  return fromJS(await get('/api/users/current'));
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
