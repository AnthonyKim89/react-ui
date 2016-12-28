import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { Map } from 'immutable';

import AssetTabBar from './AssetTabBar';
import wellTimeline from '../../apps/wellTimeline';
import AppGrid from '../../apps/components/AppGrid';

import {
  isNative,
  assetPageTabs,
  appData,
  currentAssetPageTab,
  currentWellTimeline
} from '../selectors';
import {
  subscribeApp,
  unsubscribeApp,
  moveApp,
  updateAppSettings,
  addApp,
  removeApp,
  loadWellTimeline,
  setDrillTime
} from '../actions';

import './AssetPage.css';

class AssetPage extends Component {

  componentDidMount() {
    const drillTimeParam = this.props.location.query.drillTime;
    this.props.loadWellTimeline(
      parseInt(this.props.params.assetId, 10),
      drillTimeParam ? moment(drillTimeParam) : null
    );
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.location || newProps.location.query.drillTime !== this.props.location.query.drillTime) {
      this.props.setDrillTime(
        parseInt(newProps.params.assetId, 10),
        moment(newProps.location.query.drillTime)
      );
    }
  }

  render() {
    const assetId = parseInt(this.props.params.assetId, 10);
    const drillTime = this.props.currentWellTimeline && this.props.currentWellTimeline.get('currentTime');
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
                   wellDrillTime={drillTime}
                   location={this.props.location} />}
        {!this.props.isNative &&
          <AssetTabBar assetId={assetId}
                       assetPageTabs={this.props.assetPageTabs}
                       currentAssetPageTab={this.props.currentAssetPageTab}
                       wellDrillTime={drillTime} />}
        {this.props.currentWellTimeline &&
          <wellTimeline.AppComponent
            timeline={this.props.currentWellTimeline}
            onChangeDrillTime={(...args) => this.onSetDrillTime(...args)} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentAssetPageTab, id, newCoordinates);
  }

  onAppSettingsUpdate(id, newSettings) {
    this.props.updateAppSettings(this.props.currentAssetPageTab, id, newSettings);
  }

  onSetDrillTime(time) {
    this.props.router.push(`${this.props.location.pathname}?drillTime=${time.toJSON()}`);
  }

  onAppAdd(appType) {
    this.props.addApp(this.props.currentAssetPageTab, appType, Map());
  }

  onAppRemove(id) {
    this.props.removeApp(this.props.currentAssetPageTab, id);
  }


}

export default connect(
  createStructuredSelector({
    isNative,
    assetPageTabs,
    appData,
    currentAssetPageTab,
    currentWellTimeline
  }),
  {
    subscribeApp,
    unsubscribeApp,
    moveApp,
    updateAppSettings,
    addApp,
    removeApp,
    loadWellTimeline,
    setDrillTime
  }
)(AssetPage);
