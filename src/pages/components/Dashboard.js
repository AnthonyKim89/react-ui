import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';

import apps from '../../apps';
import DashboardAppAssetSettingEditor from './DashboardAppAssetSettingEditor';

import { currentDashboard, dashboardAppAssets, isNative } from '../selectors';
import {
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
} from '../actions';
import assets from '../../assets';
import subscriptions from '../../subscriptions';

const DASHBOARD_COMMON_SETTINGS_EDITORS = List([
  Map({
    name: 'assetId',
    title: 'Active Asset',
    required: true,
    Editor: DashboardAppAssetSettingEditor
  })
]);

class Dashboard extends Component {

  componentDidMount() {
    this.loadAppAssets(this.props.currentDashboard);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentDashboard !== this.props.currentDashboard) {
      this.loadAppAssets(newProps.currentDashboard);
    }
  }

  loadAppAssets(dashboard) {
    dashboard && dashboard.get('apps').forEach(app => {
      if (app.hasIn(['settings', 'assetId'])) {
        this.props.loadAsset(app.getIn(['settings', 'assetId']));
      }
    });
  }

  render() {
    const AppLayout = this.props.currentAssetPageTab && apps.layouts[this.props.currentAssetPageTab.get('layout')];
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <AppLayout apps={this.props.currentDashboard.get('apps').valueSeq()}
                     appData={this.props.appData}
                     appAssets={this.props.dashboardAppAssets}
                     commonSettingsEditors={DASHBOARD_COMMON_SETTINGS_EDITORS}
                     onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                     onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                     onAppMove={(...a) => this.onAppMove(...a)}
                     onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                     onAppAdd={(...a) => this.onAppAdd(...a)}
                     onAppRemove={(...a) => this.onAppRemove(...a)}
                     location={this.props.location}
                     isNative={this.props.isNative} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentDashboard, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    if (newSettings.has('assetId')) {
      this.props.loadAsset(newSettings.get('assetId'));
    }
    this.props.updateAppSettings(this.props.currentDashboard, id, newSettings);
  }

  onAppAdd(appType, appSettings) {
    this.props.addApp(this.props.currentDashboard, appType, appSettings);
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentDashboard, id);
  }

}

export default connect(
  createStructuredSelector({
    currentDashboard,
    dashboardAppAssets,
    appData: subscriptions.selectors.appData,
    isNative
  }),
  {
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    loadAsset: assets.actions.loadAsset,
    subscribeApp: subscriptions.actions.subscribeApp,
    unsubscribeApp: subscriptions.actions.unsubscribeApp
  }
)(Dashboard);
