import io from 'socket.io-client';
import { fromJS } from 'immutable';

import * as auth from '../auth';

const socketUrl = process.env.REACT_APP_SUBSCRIPTIONS_URL || 'subscriptions.local.corva.ai';

let socket;

export const connect = (onReceiveData) => {
  socket = io(socketUrl);
  socket.on('connect', () => {
    socket.emit('authenticate', {token: auth.getToken()})
  });
  socket.on('data',evt => onReceiveData(evt.appInstanceId, evt.devKey, evt.collection, evt.assetId, evt.event, fromJS(evt.params), fromJS(evt.data)));
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribe = (appInstanceId, devKey, collection, assetId, event, params) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('subscribe', {appInstanceId, devKey, collection, assetId, event, params: params.toJS()});
};

export const unsubscribe = (appInstanceId, devKey, collection, event) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('unsubscribe', {appInstanceId, devKey, collection, event});
};
