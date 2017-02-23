import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';

import AppContainer from './AppContainer';
import common from '../../common';
import subscriptions from '../../subscriptions';
import * as appRegistry from '../appRegistry';

import './AppSingleLayout.css';

/**
 * Render a singleton app set. The set is expected to contain just one app which will
 * take over the whole page.
 */
class AppSingleLayout extends Component {

  render() {
    return (
      <div className="c-app-single-layout">
        {!this.props.apps.isEmpty() && this.renderApp(this.props.apps.first())}
      </div>
    );
  }

  renderApp(app) {
    const category = app.get('category');
    const name = app.get('name');
    const id = app.get('id');
    const size = common.constants.Size.XLARGE;
    const settings = app.get('settings');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);
    const appData = this.props.appData.get(id);
    return <AppContainer id={id}
                         appType={appType}
                         asset={this.props.appAssets.get(id)}
                         lastDataUpdate={subscriptions.selectors.lastDataUpdate(appData)}
                         isNative={this.props.isNative}
                         isActionsDisabled={true}
                         size={size}
                         appSettings={settings}
                         pageParams={this.getPageParams()}
                         commonSettingsEditors={this.props.commonSettingsEditors}
                         location={this.props.location}
                         onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
                         onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
                         onAppRemove={() => this.props.onAppRemove(id)}
                         onAppSettingsUpdate={(settings) => this.props.onAppSettingsUpdate(id, settings)}>
      <appType.AppComponent
        data={appData}
        asset={this.props.appAssets.get(id)}
        {...this.getPageParams().toJS()}
        {...settings.toObject()}
        size={size}
        widthCols={12}
        onAssetModified={asset => this.props.onAssetModified(asset)}
        onSettingChange={(key, value) => this.props.onAppSettingsUpdate(id, settings.set(key, value))} />
    </AppContainer>
  }

  getPageParams() {
    return this.props.pageParams || Map();
  }

}

AppSingleLayout.propTypes = {
  apps: ImmutablePropTypes.seq.isRequired,
  appData: ImmutablePropTypes.map.isRequired,
  appAssets: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  pageParams: ImmutablePropTypes.map,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onAssetModified: PropTypes.func.isRequired,
  location: PropTypes.object,
  isNative: PropTypes.bool.isRequired
};

export default AppSingleLayout;
