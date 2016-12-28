import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
import { isEqual } from 'lodash';
import { stringify as queryString } from 'query-string';

import AssetTabBar from './AssetTabBar';
import AppGrid from '../../apps/components/AppGrid';
import * as appRegistry from '../../apps/appRegistry';

import {
  isNative,
  assetPageTabs,
  appData,
  currentAsset,
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
  loadAsset
} from '../actions';

import './AssetPage.css';

class AssetPage extends Component {

  componentDidMount() {
    this.props.loadAsset(parseInt(this.props.params.assetId, 10));
    this.setPageParamsFromLocation(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.location || !isEqual(newProps.location.query, this.props.location.query)) {
      this.setPageParamsFromLocation(newProps);
    }
  }

  setPageParamsFromLocation(props) {
    this.props.setPageParams(
      parseInt(props.params.assetId, 10),
      props.location.query
    );
  }

  render() {
    const assetId = parseInt(this.props.params.assetId, 10);
    return (
      <div className="c-asset-page" >
        {this.props.currentAssetPageTab &&
          <AppGrid apps={this.props.currentAssetPageTab.get('apps').valueSeq()}
                   appData={this.props.appData}
                   onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                   onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                   onAppMove={(...a) => this.onAppMove(...a)}
                   onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                   onAppAdd={(...a) => this.onAppAdd(...a)}
                   onAppRemove={(...a) => this.onAppRemove(...a)}
                   assetId={assetId}
                   pageParams={this.props.currentPageParams}
                   location={this.props.location} />}
        {!this.props.isNative &&
          <AssetTabBar assetId={assetId}
                       assetPageTabs={this.props.assetPageTabs}
                       currentAssetPageTab={this.props.currentAssetPageTab}
                       pageParams={this.props.currentPageParams} />}
        {this.renderControlApps(assetId)}
      </div>
    );
  }

  renderControlApps(assetId) {
    if (this.props.currentAsset) {
      const apps = appRegistry.controlApps.get(this.props.currentAsset.get('type'));
      return apps.map(({constants, AppComponent}) => 
        <AppComponent
          key={constants.NAME}
          assetId={assetId}
          {...(this.props.currentPageParams && this.props.currentPageParams.toJS())}
          onUpdateParams={(...args) => this.onPageParamsUpdate(...args)} />
      );
    }
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentAssetPageTab, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentAssetPageTab, id, newSettings);
  }

  onAppAdd(appType) {
    this.props.addApp(this.props.currentAssetPageTab, appType, Map());
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
    this.props.router.push(`${this.props.location.pathname}?${queryString(allNewParams)}`);
  }


}

export default connect(
  createStructuredSelector({
    isNative,
    assetPageTabs,
    appData,
    currentAsset,
    currentAssetPageTab,
    currentPageParams
  }),
  {
    subscribeApp,
    unsubscribeApp,
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    setPageParams,
    loadAsset
  }
)(AssetPage);
