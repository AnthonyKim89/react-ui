import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';
import Modal from 'react-modal';
import { Icon } from 'react-materialize';
import { List } from 'immutable';
import { format as formatDate } from 'date-fns';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';

import AppSettingsDialog from './AppSettingsDialog';
import common from '../../common';
import * as nativeMessages from '../../nativeMessages';

import './AppContainer.css';

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {settingsDialogOpen: false};
  }

  componentDidMount() {
    if (this.props.asset) {
      this.subscribe(this.props);
    }
  }

  componentWillUnmount() {
    this.unsubscribe(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.isSubscriptionChanged(newProps)) {
      if (this.props.asset) {
        this.unsubscribe(this.props);
      }
      if (newProps.asset) {
        this.subscribe(newProps);
      }
    }
  }

  subscribe(props) {
    props.onAppSubscribe(
      props.id,
      this.getSubscriptionKeys(),
      props.asset.get('id'),
      this.getSubscriptionParams(props)
    );
  }

  unsubscribe(props) {
    props.onAppUnsubscribe(props.id, this.getSubscriptionKeys());
  }

  isSubscriptionChanged(newProps) {
    return !newProps.asset ||
           !newProps.asset.equals(this.props.asset) ||
           !this.getSubscriptionParams(newProps).equals(this.getSubscriptionParams(this.props));
  }

  getSubscriptionParams(props) {
    const paramsFromSettings = props.appType.settings
      .filter(s => s.get('includeInSubscriptionParams'))
      .map(s => [s.get('name'), props.appSettings.get(s.get('name')) || s.get('default')]);
    return props.pageParams.merge(paramsFromSettings);
  }

  getAppAssetName() {
    let assetId = this.props.appSettings.get("assetId");
    let asset = this.props.availableAssets.find(a => a.get("id") === assetId);
    return asset.get("name", "");
  }
  
  render() {
    let app_data = this.getAppData();
    const classes = {
      'c-app-container': true,
      'c-app-container--maximized': this.props.maximized,
      'c-app-container--with-title': !this.props.isTitlesDisabled && this.props.appType.constants.METADATA.title,
      'c-app-container--with-subtitle': !this.props.isTitlesDisabled  && this.props.appType.constants.METADATA.subtitle,
      'c-app-container--movable': !this.props.isNative
    };
    return (
      <div className={classSet(classes)}>
        {!this.props.isTitlesDisabled && 
          <h4 className="c-app-container__title">{this.props.appType.constants.METADATA.title}</h4>}
        {!this.props.isTitlesDisabled && this.props.appType.constants.METADATA.subtitle &&
          <h5 className="c-app-container__subtitle">{this.props.appType.constants.METADATA.subtitle}</h5>}
        {this.props.availableAssets && this.props.layoutEnvironment && this.props.layoutEnvironment.get("type") === "general" &&
          <div className="c-app-container-asset-name">{this.getAppAssetName()}</div>}
        <div className="c-app-container__content">
          { this.isErrorPresent(app_data) ? this.renderError(this.getErrorMesssage()) : this.props.children }
        </div>
        {this.isLastDataUpdateVisible() &&
          <div className="c-app-container__last-update">
            Last Update: {this.formatLastDataUpdate()}
          </div>}
        {!this.props.isActionsDisabled &&
          <div className="c-app-container__actions">
            {this.props.maximized ?
              <Link className="c-app-container__action"
                    to={{pathname: this.props.location.pathname, query: {maximize: undefined}}}
                    title="Restore"
                    onClick={() => nativeMessages.notifyAppRestored()}>
                <Icon>close</Icon>
              </Link> :
              <Link className="c-app-container__action c-app-container__action--maximize"
                    to={{pathname: this.props.location.pathname, query: {maximize: this.props.id}}}
                    title="Full screen"
                    onClick={() => nativeMessages.notifyAppMaximized()}>
                <Icon>launch</Icon>
              </Link>}
            {(!this.props.isNative || this.props.maximized) &&
              <button className="c-app-container__action c-app-container__action--settings"
                      title="Settings"
                      onClick={() => this.openSettingsDialog()}>
                <Icon>settings</Icon>
              </button>}
          </div>}
        <Modal
          isOpen={this.state.settingsDialogOpen}
          onRequestClose={() => this.closeSettingsDialog()}
          className='c-app-settings-dialog'
          overlayClassName='c-app-settings-dialog__overlay'
          contentLabel="App Settings">
          <AppSettingsDialog
            appType={this.props.appType}
            settingsEditors={this.getSettingsEditors()}
            currentSettings={this.props.appSettings}
            onDone={newSettings => this.onSettingsSave(newSettings)}
            onAppRemove={this.props.onAppRemove} />
        </Modal>
      </div>
    );
  }

  // Render the Error Message
  renderError(message = "An unknown error has occcured", error_code = "") {
    return (
      <div className="c-app-container__error">
        <div className="c-app-container__error-inner">
          <Icon style={this.props.size === common.constants.Size.SMALL ? "font-size: 2rem;" : ""}>error_outline</Icon>
          <h1>{message}</h1>
          {this.renderErrorLink(error_code)}
        </div>
      </div>
    );
  }

  renderErrorLink(error_code) {
    var text = "", url = "";
    switch(error_code) {
      case "config_missing_error":
        text = "Add well config";
        url = "/data-settings";
        break;
      default:
        text = "";
        break;
    }

    if (text !== "" && url !== "") {
      return <a href={url}>{text}</a>;
    }
  }

  getAppData() {
    return this.props && this.props.subscriptions ? this.props.subscriptions.selectors.firstSubData(this.props.data, this.getSubscriptionKeys()) : null;
  }

  // Let the component implementation display the date and others info(if necessary)
  isLastDataUpdateVisible() {
    return this.props.lastDataUpdate && !this.props.hasAppFooter && this.props.size !== common.constants.Size.SMALL;
  }

  formatLastDataUpdate() {
    const date = new Date(this.props.lastDataUpdate * 1000);
    return formatDate(date, 'M/D/YYYY h:mm a');
  }

  getSettingsEditors() {
    const common = this.props.commonSettingsEditors || List();
    const forAppType = this.props.appType.settings || List();
    return common.concat(forAppType);
  }

  openSettingsDialog() {
    this.setState({settingsDialogOpen: true});
  }

  closeSettingsDialog() {
    this.setState({settingsDialogOpen: false});
  }
  
  onSettingsSave(newSettings) {
    this.closeSettingsDialog();
    this.props.onAppSettingsUpdate(newSettings);
  }

  getSubscriptionKeys() {
    return this.props.appType.constants.SUBSCRIPTIONS;
  }

    // Is there an Error key present in the data. 
  isErrorPresent(data, error_key = "error") {
    return data && true;
    return data && typeof this.findKey(data, error_key) === "object";
  }

  // Try to get the error message automatically
  getErrorMesssage(data, message_key = "error") {
    return "An unknown error has occcured";
    return this.findKey(data, message_key) || null;
  }

  // Find key in JSON object
  // http://stackoverflow.com/questions/15642494/find-property-by-name-in-a-deep-object
  findKey(obj, key) {
      if (_.has(obj, key)) // or just (key in obj)
          return [obj];

      return _.flatten(_.map(obj, function(v) {
          return typeof v === "object" ? this.findKey(v, key) : [];
      }), true);
  }

}

AppContainer.propTypes = {
  id: PropTypes.number.isRequired,
  asset: ImmutablePropTypes.map,
  appType: PropTypes.object.isRequired,
  //lastDataUpdate: PropTypes.number,
  location: PropTypes.object.isRequired,
  isNative: PropTypes.bool.isRequired,
  isActionsDisabled: PropTypes.bool,
  isTitlesDisabled: PropTypes.bool,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  maximized: PropTypes.bool,
  appSettings: ImmutablePropTypes.map.isRequired,
  pageParams: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  layoutEnvironment: ImmutablePropTypes.map,
  availableAssets: ImmutablePropTypes.list,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired
};

export default AppContainer;
