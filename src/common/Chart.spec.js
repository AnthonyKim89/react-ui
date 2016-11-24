import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { List } from 'immutable';

import Chart from './Chart';
import ChartSeries from './ChartSeries';

it('renders without crashing', () => {
  shallow(<Chart>
    <ChartSeries type="line" data={List()} />
  </Chart>);
});