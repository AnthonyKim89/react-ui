import React from 'react';
import { Route } from 'react-router';

import App from './App';
import Login from './login/components/Login';
import Dashboard from './pages/components/Dashboard';
import WellPage from './pages/components/WellPage';

export const routes =
  <Route path="/" component={App}>
    <Route path="login" component={Login} />
    <Route path="dashboards/:dashboardId" component={Dashboard} />
    <Route path="wells/:wellId/:category" component={WellPage} />
  </Route>;
