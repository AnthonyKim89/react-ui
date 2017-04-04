import { createSelector } from 'reselect';
import { identity } from 'lodash';
import { NAME } from './constants';

const stateSelector = state => state[NAME];

export const appData = createSelector(
  stateSelector,
  state => state.get('appData')
);


export function firstSubData(data, [firstSub]) {
  return getSubData(data, firstSub);
}

export function getSubData(data, {provider, collection, event = ''}) {
  return data && data.getIn([provider, collection, event]);
}



/**
 * Given all the data stored for an app, find the timestamp of the latest data
 * appData will be a nested Map in the shape of
 * {appKey1: {collectionId1: {event1: data, event2: data}, collectionId2: {event3: data}}, appKey2: {...}}
 *
 * We look at the "timestamp" attribute in data records where it exists.
 */
export function lastDataUpdate(appData) {
  if (!appData) {
    return null;
  }
  return appData
    .valueSeq()
    .map(coll => coll.valueSeq()
                     .map(evts => evts.valueSeq())
                     .flatten(1)
                     .map(d => d.get('timestamp')))
    .flatten()
    .filter(identity)
    .max();
}