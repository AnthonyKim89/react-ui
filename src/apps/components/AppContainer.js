import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';
import Modal from 'react-modal';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AppSettingsDialog from './AppSettingsDialog';

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
    if (!newProps.asset ||
        !newProps.asset.equals(this.props.asset) ||
        !newProps.pageParams.equals(this.props.pageParams)) {
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
      props.id, this.getAppKey(), props.asset.get('id'), props.pageParams);
  }

  unsubscribe(props) {
    props.onAppUnsubscribe(props.id);
  }
  
  render() {
    const classes = {
      'c-app-container': true,
      'c-app-container--maximized': this.props.maximized,
      'c-app-container--with-subtitle': this.props.appType.constants.SUBTITLE
    };
    return (
      <div className={classSet(classes)}>
        {this.props.maximized ?
          <Link className="c-app-container__action c-app-container__action--size"
                to={{pathname: this.props.location.pathname, query: {maximize: undefined}}}
                title="Restore">
          </Link> :
          <Link className="c-app-container__action c-app-container__action--size"
                to={{pathname: this.props.location.pathname, query: {maximize: this.props.id}}}
                title="Full screen">
          </Link>}
        <button className="c-app-container__action c-app-container__action--settings"
                title="Settings"
                onClick={() => this.openSettingsDialog()}>
        </button>
        <h4 className="c-app-container__title">{this.props.appType.constants.METADATA.title}</h4>
        {this.props.appType.constants.METADATA.subtitle &&
          <h5 className="c-app-container__subtitle">{this.props.appType.constants.METADATA.subtitle}</h5>}
        <div className="c-app-container__content">
          {this.props.children}
        </div>
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

  getSettingsEditors() {
    const forAppType = this.props.appType.settingsEditors || List();
    const common = this.props.commonSettingsEditors || List();
    return forAppType.concat(common);
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

  getAppKey() {
    return `${this.props.appType.constants.CATEGORY}/${this.props.appType.constants.NAME}`;
  }

}

AppContainer.propTypes = {
  id: PropTypes.number.isRequired,
  asset: ImmutablePropTypes.map,
  appType: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  maximized: PropTypes.bool,
  appSettings: ImmutablePropTypes.map.isRequired,
  pageParams: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired
};

export default AppContainer;
