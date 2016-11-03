import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

import App from './App';
import Dashboard from './Dashboard';
import WidgetGrid from './widget/WidgetGrid';
import Analytics from './Analytics';

const tabRoutes = [
  <IndexRoute key="overview" component={WidgetGrid} />,
  <Route path="tandd" key="tandd" component={WidgetGrid} />,
  <Route path="efficiency" key="efficiency" component={WidgetGrid} />,
  <Route path="stability" key="stability" component={WidgetGrid} />,
  <Route path="hydraulics" key="hydraulics" component={WidgetGrid} />,
  <Route path="bit" key="bit" component={WidgetGrid} />,
  <Route path="motor" key="motor" component={WidgetGrid} />,
  <Route path="losses" key="losses" component={WidgetGrid} />,
  <Route path="raw" key="raw" component={WidgetGrid} />,
];

export const routes =
  <Route path="/" component={App}>
    <IndexRedirect to="/dashboards" />
    <Route path="dashboards" component={Dashboard}>
      {tabRoutes}
    </Route>
    <Route path="wells" component={Dashboard}>
      {tabRoutes}
    </Route>
    <Route path="analytics" component={Analytics}/>
  </Route>;
