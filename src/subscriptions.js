import io from 'socket.io-client';
import { fromJS } from 'immutable';

let socket;

export const connect = (onReceiveData) => {
  socket = io(`${location.protocol}//${location.hostname}:3002`);
  socket.on('data', evt => onReceiveData(evt.appInstanceId, fromJS(evt.data)));
};

export const subscribe = (appInstanceId, appKey, assetId) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('subscribe', {appInstanceId, appKey, assetId});
};

export const unsubscribe = (appInstanceId) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('unsubscribe', {appInstanceId}); 
};