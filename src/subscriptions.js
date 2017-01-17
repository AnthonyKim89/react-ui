import io from 'socket.io-client';
import { fromJS } from 'immutable';

import * as auth from './auth';

let socket;

export const connect = (onReceiveData) => {
  socket = io(`${location.protocol}//${location.hostname}:3002`);
  socket.on('connect', () => {
    socket.emit('authenticate', {token: auth.getToken()})
  });
  socket.on('data',evt => onReceiveData(evt.appInstanceId, evt.appKey, evt.assetId, fromJS(evt.params), fromJS(evt.data)));
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export const subscribe = (appInstanceId, appKey, assetId, params) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('subscribe', {appInstanceId, appKey, assetId, params: params.toJS()});
};

export const unsubscribe = (appInstanceId, appKey) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('unsubscribe', {appInstanceId, appKey}); 
};