import { stringify as queryString } from 'query-string';
import { fromJS, Map } from 'immutable';

import * as auth from './auth';

class APIException {

  constructor(status, statusText) {
    this.status = status;
    this.statusText = statusText;
  }

  isAuthenticationProblem() {
    return this.status === 403 || this.status === 401;
  }
}

const baseUrl = process.env.REACT_APP_API_URL || 'http://api.local.corva.ai';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

function attachAuthorizationHeader(requestConfig) {
  const token = auth.getToken();
  if (token) {
    const headers = requestConfig.headers || {};
    requestConfig = Object.assign({}, requestConfig, {
      headers: Object.assign({}, headers, {
        Authorization: `Bearer ${token}`
      })
    });
  }
  return requestConfig;
}

async function request(path, config = {}) {
  const response = await fetch(`${baseUrl}${path}`, attachAuthorizationHeader(config));
  if (response.ok) {
    if (response.status === 204) { // No content
      return null;
    } else {
      return fromJS(await response.json());
    }
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
  const response = fromJS(await post('/v1/user_token', {
    auth: {email, password}
  }));
  auth.setToken(response.get('jwt'));
  return response;
}

export async function logOut() {
  auth.removeToken();
  return await new Promise(r => r(true));
}

export async function getCurrentUser() {
  return fromJS(await get('/v1/users/current'));
}

export async function getAppSets(userId) {
  const data = await get(`/v1/users/${userId}/app_sets`);
  return fromJS(data);
}

export async function getAppSet(userId, id) {
  const data = await get(`/v1/users/${userId}/app_sets/${id}`);
  return fromJS(data);
}

export async function postAppSet(userId, app_set) {
  if (Map.isMap(app_set)) {
    app_set = app_set.toJS();
  }
  const data = await post(`/v1/users/${userId}/app_sets`, app_set);
  return fromJS(data);
}

export async function putAppSet(userId, id, app_set) {
  if (Map.isMap(app_set)) {
    app_set = app_set.toJS();
  }
  const data = await put(`/v1/users/${userId}/app_sets/${id}`, app_set);
  return fromJS(data);
}

export async function deleteAppSet(userId, id) {
  const data = await del(`/v1/users/${userId}/app_sets/${id}`);
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

export async function getAssets(types = []) {
  const typeQuery = types.map(t => `types[]=${t}`).join('&');
  const data = await get(`/v1/assets?${typeQuery}`);
  return fromJS(data);
}

export async function getAsset(id) {
  const data = await get(`/v1/assets/${id}`);
  return fromJS(data);
}

export async function getActiveChildAsset(id) {
  const data = await get(`/v1/assets/${id}/active_child`);
  return fromJS(data);
}

export async function postAsset(asset) {
  if (Map.isMap(asset)) {
    asset = asset.toJS();
  }
  const data = await post(`/v1/assets`, asset);
  return fromJS(data);
}

export async function putAsset(id, asset) {
  if (Map.isMap(asset)) {
    asset = asset.toJS();
  }
  const data = await put(`/v1/assets/${id}`, asset);
  return fromJS(data);
}

export async function deleteAsset(id) {
  const data = await del(`/v1/assets/${id}`);
  return fromJS(data);
}

export async function getAppStorage(provider, collection, assetId, params = Map()) {
  const qry = queryString(params.merge({asset_id: assetId}).toJS());
  const data = await get(`/v1/data/${provider}/${collection}?${qry}`);
  return fromJS(data);
}

export async function postAppStorage(provider, collection, item) {
  const response = await post(`/v1/data/${provider}/${collection}`, item.toJS());
  return fromJS(response);
}

export async function postTaskDocument(provider, collection, data, params = Map()) {
  const qry = queryString(params.toJS());  
  const response = await post(`/v1/tasks/${provider}/${collection}?${qry}`, {data});
  return fromJS(response);
}

export async function putAppStorage(provider, collection, id, item) {
  const response = await put(`/v1/data/${provider}/${collection}/${id}`, item.toJS());
  return fromJS(response);
}

export async function deleteAppStorage(provider, collection, id) {
  const response = await del(`/v1/data/${provider}/${collection}/${id}`);
  return fromJS(response);
}

export async function getWellTimeline(wellId) {
  const data = await get(`/v1/jobs/${wellId}/drill_view_timeline_slider`);
  return fromJS(data);
}

export async function getS3SignedUrl(filename,contentType) {
  const data = await get(`/v1/file/sign?file_name=${filename}&contentType=${contentType}`);  
  return fromJS(data);
}

export function getFileDownloadLink(filename) {
  const token = auth.getToken();
  return `${baseUrl}/v1/file/download?file_name=${filename}&authorization=${token}`;  
}
