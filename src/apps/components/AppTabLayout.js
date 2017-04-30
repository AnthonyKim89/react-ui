import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';

import AppContainer from './AppContainer';
import common from '../../common';
import subscriptions from '../../subscriptions';
import * as appRegistry from '../appRegistry';
import Convert from '../../common/Convert';

import './AppTabLayout.css';

/**
 * Render an app set in a "tab layout" - a tab bar with a tab for each app, with
 * one app visible at a time.
 */
class AppTabLayout extends Component {

  render() {
    return (
      <div className="c-app-tab-layout">
        <div className="c-app-tab-layout__tab-bar">
          <div className="c-app-tab-layout__tab-bar-inner">
            <h5>Sections</h5>
            <ul>
              {this.props.apps.map((app, idx) =>
                <li key={idx}
                  className={(this.props.subSlug === app.get('name') || (!this.props.subSlug && idx===0)) ? 'c-app-tab-layout__tab--selected' : ''}
                >
                  <Link to={this.getLocation(app)}>
                    {this.renderAppTabContent(app)}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>
        <div className="c-app-tab-layout__app">
          {this.renderSelectedApp()}
        </div>
      </div>
    );
  }

  renderAppTabContent(app) {
    const category = app.get('category');
    const name = app.get('name');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);
    return (appType === undefined) ? "Not Found" : appType.constants.METADATA.title;
  }

  renderSelectedApp() {
    if (this.props.apps.isEmpty()) {
      return;
    }
    const app = this.props.subSlug? this.props.apps.filter(app=>app.get('name')).get(0) : this.props.apps.get(0);
    if (!app) {
      return;
    }
    const category = app.get('category');
    const name = app.get('name');
    const id = app.get('id');
    const coordinates = app.get('coordinates');
    const size = common.constants.Size.XLARGE;
    const settings = app.get('settings');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);
    const appData = this.props.appData.get(id);
    const errorData = subscriptions.selectors.getSubErrors(appData, appType.constants.SUBSCRIPTIONS);
    return (appType === undefined) ? "Not Found" : <AppContainer id={id}
                         errorData={errorData}
                         appType={appType}
                         asset={this.props.appAssets.get(id)}
                         lastDataUpdate={subscriptions.selectors.lastDataUpdate(appData)}
                         isNative={this.props.isNative}
                         isActionsDisabled={true}
                         isTitlesDisabled={true}
                         size={size}
                         coordinates={coordinates}
                         appSettings={settings}
                         pageParams={this.getPageParams()}
                         commonSettingsEditors={this.props.commonSettingsEditors}
                         location={this.props.location}
                         onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
                         onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
                         onAppRemove={() => this.props.onAppRemove(id)}
                         onAppSettingsUpdate={(settings) => this.props.onAppSettingsUpdate(id, settings)}>
      {!errorData && <appType.AppComponent
        data={appData}
        asset={this.props.appAssets.get(id)}
        {...this.getPageParams().toJS()}
        {...settings.toObject()}
        size={size}
        widthCols={12}
        convert={this.props.convert}
        onAssetModified={asset => this.props.onAssetModified(asset)}
        onSettingChange={(key, value) => this.props.onAppSettingsUpdate(id, settings.set(key, value))} />}
    </AppContainer>;
  }

  getPageParams() {
    return this.props.pageParams || Map();
  }

  getLocation(app) {
    const {assetId, slug} = this.props.params;
    return {
      pathname: `/assets/${assetId}/${slug}/${app.get('name')}`,
      query: this.props.pageParams && this.props.pageParams.toJS()
    };
  }
}

AppTabLayout.propTypes = {
  apps: ImmutablePropTypes.seq.isRequired,
  appData: ImmutablePropTypes.map.isRequired,
  appAssets: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  pageParams: ImmutablePropTypes.map,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onAssetModified: PropTypes.func.isRequired,
  location: PropTypes.object,
  isNative: PropTypes.bool.isRequired
};

export default AppTabLayout;
