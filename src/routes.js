import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Dashboard from './Dashboard';
import WellPage from './WellPage';
import WidgetGrid from './widgets/WidgetGrid';


export const routes =
  <Route path="/" component={App}>
    <Route path="dashboards/:dashboardId" component={Dashboard} />
    <Route path="wells" component={WellPage}>
      <IndexRoute key="overview" component={WidgetGrid} />,
      <Route path="tandd" key="tandd" component={WidgetGrid} />,
      <Route path="efficiency" key="efficiency" component={WidgetGrid} />,
      <Route path="stability" key="stability" component={WidgetGrid} />,
      <Route path="hydraulics" key="hydraulics" component={WidgetGrid} />,
      <Route path="bit" key="bit" component={WidgetGrid} />,
      <Route path="motor" key="motor" component={WidgetGrid} />,
      <Route path="losses" key="losses" component={WidgetGrid} />,
      <Route path="raw" key="raw" component={WidgetGrid} />,
    </Route>
  </Route>;
