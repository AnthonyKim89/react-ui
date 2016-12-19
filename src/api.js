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
  return fromJS(await get('/session'));
}

export async function getAppSets(userId) {
  const data = await get(`/users/${userId}/app_sets`);
  return fromJS(data);
}

export async function createApp(userId, appSetId, app) {
  return await post(
    `/users/${userId}/app_sets/${appSetId}/apps`,
    app.toJS()
  );
}

export async function updateApp(userId, appSetId, app) {
  return await put(
    `/users/${userId}/app_sets/${appSetId}/apps/${app.get('id')}`,
    app.toJS()
  );
}

export async function deleteApp(userId, appSetId, appId) {
  return await del(`/users/${userId}/app_sets/${appSetId}/apps/${appId}`);
}

export async function getRigs() {
  const data = await get(`/rigs`);
  return fromJS(data);
}

export async function getRig(id) {
  const data = await get(`/rigs/${id}`);
  return fromJS(data);
}


export async function getWellTimeline(wellId) {
  const data = await get(`/jobs/${wellId}/drill_view_timeline_slider`);
  return fromJS(data);
}

export async function getTorque({wellId, date}) {
  const queryParams = {date: date.unix()};
  const data = await get(`/jobs/${wellId}/broomstick_chart`, queryParams);
  return fromJS(data);
}
