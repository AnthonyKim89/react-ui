import { stringify as queryString } from 'query-string';
import { fromJS } from 'immutable';

const JWT_STORAGE_KEY = 'jwt';

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
  const jwt = localStorage.getItem(JWT_STORAGE_KEY);
  if (jwt) {
    const headers = config.headers || {};
    config = Object.assign({}, config, {
      headers: Object.assign({}, headers, {
        Authorization: `Bearer ${jwt}`
      })
    });
  }
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
  const response = fromJS(await post('/user_token', {
    auth: {email, password}
  }));
  localStorage.setItem(JWT_STORAGE_KEY, response.get('jwt'));
  return response;
}

export async function logOut() {
  localStorage.removeItem(JWT_STORAGE_KEY);
  return await new Promise(r => r(true));
}

export async function getCurrentUser() {
  return fromJS(await get('/v1/users/current'));
}

export async function getAppSets(userId) {
  const data = await get(`/v1/users/${userId}/app_sets`);
  return fromJS(data);
}

export async function createApp(userId, appSetId, app) {
  return await post(
    `/v1/users/${userId}/app_sets/${appSetId}/apps`,
    app.toJS()
  );
}

export async function updateApp(userId, appSetId, app) {
  return await put(
    `/v1/users/${userId}/app_sets/${appSetId}/apps/${app.get('id')}`,
    app.toJS()
  );
}

export async function deleteApp(userId, appSetId, appId) {
  return await del(`/v1/users/${userId}/app_sets/${appSetId}/apps/${appId}`);
}

export async function getAssets(type) {
  const data = await get(`/v1/assets?type=${type}`);
  return fromJS(data);
}

export async function getAsset(id) {
  const data = await get(`/v1/assets/${id}`);
  return fromJS(data);
}


export async function getWellTimeline(wellId) {
  const data = await get(`/v1/jobs/${wellId}/drill_view_timeline_slider`);
  return fromJS(data);
}

export async function getTorque({wellId, date}) {
  const queryParams = {date: date.unix()};
  const data = await get(`/v1/jobs/${wellId}/broomstick_chart`, queryParams);
  return fromJS(data);
}
