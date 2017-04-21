import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
import { isEqual, isNull, omitBy } from 'lodash';
import { stringify as queryString } from 'query-string';

import AssetTabBar from './AssetTabBar';
import apps from '../../apps';
import * as appRegistry from '../../apps/appRegistry';
import Convert from '../../common/Convert';

import {
  isNative,
  assetDashboards,
  currentAssetDashboards,
  currentPageParams
} from '../selectors';
import {
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
  setPageParams,
} from '../actions';
import assets from '../../assets';
import subscriptions from '../../subscriptions';

import './AssetPage.css';

const DASHBOARD_ENV = Map({
  type: "asset",
});

class AssetPage extends Component {

  constructor(props) {
    super(props);
    this.convert = new Convert();
  }

  componentDidMount() {
    this.props.loadAsset(this.getAssetId());
    this.setPageParamsFromLocation(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.location || !isEqual(newProps.location.query, this.props.location.query)) {
      this.setPageParamsFromLocation(newProps);
    }
  }

  setPageParamsFromLocation(props) {
    this.props.setPageParams(
      this.getAssetId(),
      props.location.query
    );
  }

  render() {
    const AppLayout = this.props.currentAssetDashboards && apps.layouts[this.props.currentAssetDashboards.get('layout', 'grid')];
    return (
      <div className="c-asset-page" >
        {!this.props.isNative &&
        <AssetTabBar assetId={this.getAssetId()}
                     assetDashboards={this.props.assetDashboards}
                     currentAssetDashboards={this.props.currentAssetDashboards}
                     pageParams={this.props.currentPageParams} />}
        {this.props.currentAssetDashboards &&
          <AppLayout apps={this.props.currentAssetDashboards.get('apps').valueSeq()}
                     appData={this.props.appData}
                     appAssets={this.getAppAssets()}
                     convert={this.convert}
                     onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                     onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                     onAppMove={(...a) => this.onAppMove(...a)}
                     onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                     onAppAdd={(...a) => this.onAppAdd(...a)}
                     onAppRemove={(...a) => this.onAppRemove(...a)}
                     onAssetModified={asset => this.props.reloadAsset(asset.get('id'))}
                     pageParams={this.props.currentPageParams}
                     location={this.props.location}
                     environment={DASHBOARD_ENV}
                     isNative={this.props.isNative} />}
        {this.shouldRenderControlApps() && this.renderControlApps()}
      </div>
    );
  }

  shouldRenderControlApps() {
    return !this.props.isNative && this.props.currentAssetDashboards && this.props.currentAssetDashboards.get('settings').get('show_control_apps', true);
  }

  renderControlApps() {
    if (this.props.currentAsset) {
      const apps = appRegistry.controlApps.get(this.props.currentAsset.get('asset_type'));
      return apps.map(({constants, AppComponent}) => 
        <AppComponent
          key={constants.NAME}
          id={constants.NAME}
          convert={this.convert}
          data={this.props.appData.get(constants.NAME)}
          subscribeApp={(...a) => this.props.subscribeApp(...a)}
          unsubscribeApp={(...a) => this.props.unsubscribeApp(...a)}
          asset={this.props.currentAsset}
          {...(this.props.currentPageParams && this.props.currentPageParams.toJS())}
          onUpdateParams={(...args) => this.onPageParamsUpdate(...args)} />
      );
    }
  }

  getAppAssets() {
    if (this.props.currentAssetDashboards) {
      return Map(this.props.currentAssetDashboards.get('apps').map(() => this.props.currentAsset));
    } else {
      return Map();
    }
  }
  
  getAssetId() {
    return parseInt(this.props.params.assetId, 10);
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentAssetDashboards, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentAssetDashboards, id, newSettings);
  }

  onAppAdd(appType, appSettings) {
    this.props.addApp(this.props.currentAssetDashboards, appType, appSettings);
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentAssetDashboards, id);
  }

  onPageParamsUpdate(newParams) {
    const allNewParams = Object.assign(
      {},
      this.props.pageParams && this.props.pageParams.toJS(),
      newParams
    );
    const nonNullParams = omitBy(allNewParams, isNull);
    this.props.router.push(`${this.props.location.pathname}?${queryString(nonNullParams)}`);
  }


}

export default connect(
  createStructuredSelector({
    isNative,
    assetDashboards,
    currentAssetDashboards,
    currentPageParams,
    currentAsset: assets.selectors.currentAsset,
    appData: subscriptions.selectors.appData
  }),
  {
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    setPageParams,
    loadAsset: assets.actions.loadAsset,
    reloadAsset: assets.actions.reloadAsset,
    subscribeApp: subscriptions.actions.subscribeApp,
    unsubscribeApp: subscriptions.actions.unsubscribeApp,
  }
)(AssetPage);
