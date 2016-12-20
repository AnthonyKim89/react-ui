import io from 'socket.io-client';
import uuid from 'uuid/v1';

let socket;

export const connect = () => {
  socket = io(`${location.protocol}//${location.hostname}:3002`);
};

export const subscribe = (appId, assetId) => {
  if (!socket) { throw new Error('Not connected'); }
  const subscriptionId = uuid();
  socket.emit('subscribe', {appId, assetId, subscriptionId});
  return subscriptionId; 
};

export const unsubscribe = (subscriptionId) => {
  if (!socket) { throw new Error('Not connected'); }
  socket.emit('unsubscribe', {subscriptionId}); 
};