import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './App';
import Login from './login/components/Login';
import assets from './assets';
import Dashboard from './pages/components/Dashboard';
import AppPage from './pages/components/AppPage';
import AssetListPage from './pages/components/AssetListPage';
import AssetPage from './pages/components/AssetPage';

export const routes =
  <Route path="/" component={App}>
    <Route name="login" path="login" component={Login} />
    <Route path="dashboards/:slug" component={Dashboard} />
    <Route path="apps">
      <Route path=":category/:name" component={AppPage} />
    </Route>
    <Route path="assets">
      <IndexRedirect to={assets.constants.ASSET_TYPES.keySeq().first()} />
      <Route path=":assetType" component={AssetListPage} />
      <Route path=":assetId/:slug(/:subSlug)" component={AssetPage} />
    </Route>
  </Route>;
