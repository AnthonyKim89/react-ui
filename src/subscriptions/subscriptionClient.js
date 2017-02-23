import io from 'socket.io-client';
import { fromJS } from 'immutable';

import * as auth from '../auth';

const socketUrl = process.env.REACT_APP_SUBSCRIPTIONS_URL ||
                  process.env.REACT_APP_API_URL ||
                  `${location.protocol}//${location.hostname}:3002`;

let socket;

export const connect = (onReceiveData) => {
  socket = io(socketUrl);
  socket.on('connect', () => {
    socket.emit('authenticate', {token: auth.getToken()})
  });
  socket.on('data',evt => onReceiveData(evt.appInstanceId, evt.appKey, evt.collection, evt.assetId, fromJS(evt.params), fromJS(evt.data)));
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribe = (appInstanceId, appKey, collection, assetId, params) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('subscribe', {appInstanceId, appKey, collection, assetId, params: params.toJS()});
};

export const unsubscribe = (appInstanceId, appKey, collection) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('unsubscribe', {appInstanceId, appKey, collection}); 
};