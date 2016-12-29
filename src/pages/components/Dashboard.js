import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Map } from 'immutable';

import AppGrid from '../../apps/components/AppGrid';
import DashboardAppAssetSettingEditor from './DashboardAppAssetSettingEditor';

import { currentDashboard, appData } from '../selectors';
import {
  subscribeApp,
  unsubscribeApp,
  moveApp,
  updateAppSettings,
  addApp,
  removeApp
} from '../actions';

const DASHBOARD_COMMON_SETTINGS_EDITORS = [
  {
    name: 'assetId',
    title: 'Active Asset',
    Editor: DashboardAppAssetSettingEditor
  }
];

class Dashboard extends Component {
  render() {
    return (
      <div className="c-dashboard" >
        {this.props.currentDashboard &&
          <AppGrid apps={this.props.currentDashboard.get('apps').valueSeq()}
                   appData={this.props.appData}
                   commonSettingsEditors={DASHBOARD_COMMON_SETTINGS_EDITORS}
                   onAppSubscribe={(...a) => this.props.subscribeApp(...a)}
                   onAppUnsubscribe={(...a) => this.props.unsubscribeApp(...a)}
                   onAppMove={(...a) => this.onAppMove(...a)}
                   onAppSettingsUpdate={(...a) => this.onAppSettingsUpdate(...a)}
                   onAppAdd={(...a) => this.onAppAdd(...a)}
                   onAppRemove={(...a) => this.onAppRemove(...a)}
                   location={this.props.location} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentDashboard, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentDashboard, id, newSettings);
  }

  onAppAdd(appType) {
    this.props.addApp(this.props.currentDashboard, appType, Map({wellId: 1016}));
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentDashboard, id);
  }

}

export default connect(
  createStructuredSelector({
    currentDashboard,
    appData
  }),
  {subscribeApp, unsubscribeApp, moveApp, updateAppSettings, addApp, removeApp}
)(Dashboard);
