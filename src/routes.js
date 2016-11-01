import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import DashboardsPage from './pages/DashboardsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WellsPage from './pages/WellsPage';

export const routes =
  <Route path="/" component={App}>
    <IndexRoute component={DashboardsPage} />
    <Route path="analytics" component={AnalyticsPage} />
    <Route path="wells" component={WellsPage} />
  </Route>;
