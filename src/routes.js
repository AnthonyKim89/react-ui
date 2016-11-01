import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

import App from './App';
import Dashboard from './Dashboard';
import WidgetContainer from './widget/WidgetContainer';
import Analytics from './Analytics';

const tabRoutes = [
  <IndexRoute key="overview" component={WidgetContainer} />,
  <Route path="tandd" key="tandd" component={WidgetContainer} />,
  <Route path="efficiency" key="efficiency" component={WidgetContainer} />,
  <Route path="stability" key="stability" component={WidgetContainer} />,
  <Route path="hydraulics" key="hydraulics" component={WidgetContainer} />,
  <Route path="bit" key="bit" component={WidgetContainer} />,
  <Route path="motor" key="motor" component={WidgetContainer} />,
  <Route path="losses" key="losses" component={WidgetContainer} />,
  <Route path="raw" key="raw" component={WidgetContainer} />,
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
