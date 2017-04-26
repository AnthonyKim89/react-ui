import React from 'react';
import { mount } from 'enzyme';

import StallsHistoryApp from './StallsHistoryApp';

it('renders', () => {
  const wrapper = mount(<StallsHistoryApp />);
  expect(wrapper.length).toBe(1);
});
