import React from 'react';
import { mount } from 'enzyme';
import { Map, Seq } from 'immutable';

import Convert from '../../common/Convert';
import AppGridLayout from './AppGridLayout';

it('renders a fallback when mismatching app registry state exists', () => {
  global.console.log = jest.fn();
  const noop = () => {};
  const convert = new Convert();
  const fakeCoordinates = Map({
    x: 1,
    y: 2,
    w: 3,
    h: 4
  });
  const fakeApp = Map({
    id: 1,
    category: 'doesnotexist',
    name: 'sorry',
    coordinates: fakeCoordinates
  });
  const emptySeq = Seq([fakeApp]);
  const emptyMap = Map();
  const location = { query: { maximize: 'nope' } };
  mount(
    <AppGridLayout
      apps={emptySeq}
      appData={emptyMap}
      appAssets={emptyMap}
      onAppSubscribe={noop}
      onAppUnsubscribe={noop}
      onAppMove={noop}
      onAppSettingsUpdate={noop}
      onAppAdd={noop}
      onAppRemove={noop}
      onAssetModified={noop}
      convert={convert}
      isNative={true}
      location={location}
      measureBeforeMount={false}
      width={1000}
    />);
  expect(console.log).toBeCalledWith('No UI app found for doesnotexist:sorry.');
});
