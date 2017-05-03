import React from 'react';
import { mount } from 'enzyme';

import OverviewApp from './OverviewApp';

it('renders', () => {
  const wrapper = mount(<OverviewApp />);
  expect(wrapper.length).toBe(1);
});
