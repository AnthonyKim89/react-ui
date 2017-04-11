import React from 'react';
import { shallow } from 'enzyme';
import { Map, Seq } from 'immutable';

import AppGridLayout from './AppGridLayout';

it('renders a fallback when mismatching app registry state exists', () => {
  global.console.log = jest.fn();
  const noop = () => {};
  const fakeCoordinates = Map({
    x: 1,
    y: 2
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
  shallow(
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
      convert={noop}
      isNative={true}
      location={location}
    />);
  expect(console.log).toBeCalledWith('No UI app found for doesnotexist:sorry.');
});
