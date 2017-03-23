import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';

import Chart from './Chart';
import ChartSeries from './ChartSeries';
import { Size } from './constants';

it('renders without crashing', () => {
  shallow(<Chart size={Size.SMALL} widthCols={5}>
    <ChartSeries id="1" type="line" data={List()} />
  </Chart>);
});