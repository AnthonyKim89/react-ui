import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
import { isEqual, isNull, omitBy } from 'lodash';
import { stringify as queryString } from 'query-string';

import AssetTabBar from './AssetTabBar';
import AppGrid from '../../apps/components/AppGrid';
import * as appRegistry from '../../apps/appRegistry';

import {
  isNative,
  assetPageTabs,
  appData,
  currentAssetPageTab,
  currentPageParams
} from '../selectors';
import {
  subscribeApp,
  unsubscribeApp,
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
  setPageParams,
} from '../actions';
import assets from '../../assets';

import './AssetPage.css';

class AssetPage extends Component {

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
    return (
      <div className="c-asset-page" >
        {this.props.currentAssetPageTab &&
          <AppGrid apps={this.props.currentAssetPageTab.get('apps').valueSeq()}
                   appData={this.props.appData}
                   appAssets={this.getAppAssets()}
                   onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                   onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                   onAppMove={(...a) => this.onAppMove(...a)}
                   onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                   onAppAdd={(...a) => this.onAppAdd(...a)}
                   onAppRemove={(...a) => this.onAppRemove(...a)}
                   pageParams={this.props.currentPageParams}
                   location={this.props.location} />}
        {!this.props.isNative &&
          <AssetTabBar assetId={this.getAssetId()}
                       assetPageTabs={this.props.assetPageTabs}
                       currentAssetPageTab={this.props.currentAssetPageTab}
                       pageParams={this.props.currentPageParams} />}
        {this.renderControlApps()}
      </div>
    );
  }

  renderControlApps() {
    if (this.props.currentAsset) {
      const apps = appRegistry.controlApps.get(this.props.currentAsset.get('asset_type'));
      return apps.map(({constants, AppComponent}) => 
        <AppComponent
          key={constants.NAME}
          asset={this.props.currentAsset}
          {...(this.props.currentPageParams && this.props.currentPageParams.toJS())}
          onUpdateParams={(...args) => this.onPageParamsUpdate(...args)} />
      );
    }
  }

  getAppAssets() {
    if (this.props.currentAssetPageTab) {
      return Map(this.props.currentAssetPageTab.get('apps').map(() => this.props.currentAsset));
    } else {
      return Map();
    }
  }
  
  getAssetId() {
    return parseInt(this.props.params.assetId, 10);
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentAssetPageTab, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentAssetPageTab, id, newSettings);
  }

  onAppAdd(appType, appSettings) {
    this.props.addApp(this.props.currentAssetPageTab, appType, appSettings);
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentAssetPageTab, id);
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
    assetPageTabs,
    appData,
    currentAssetPageTab,
    currentPageParams,
    currentAsset: assets.selectors.currentAsset,
  }),
  {
    subscribeApp,
    unsubscribeApp,
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    setPageParams,
    loadAsset: assets.actions.loadAsset
  }
)(AssetPage);
