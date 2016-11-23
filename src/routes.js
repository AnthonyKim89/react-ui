import React from 'react';
import { Route } from 'react-router';

import App from './App';
import Dashboard from './Dashboard';
import WellPage from './WellPage';

export const routes =
  <Route path="/" component={App}>
    <Route path="dashboards/:dashboardId" component={Dashboard} />
    <Route path="wells/:wellId/:category" component={WellPage} />
  </Route>;
