import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';
import Modal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AppSettingsDialog from './AppSettingsDialog';

import './AppContainer.css';

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {settingsDialogOpen: false};
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
        <h4 className="c-app-container__title">{this.props.appType.constants.TITLE}</h4>
        {this.props.appType.constants.SUBTITLE &&
          <h5 className="c-app-container__subtitle">{this.props.appType.constants.SUBTITLE}</h5>}
        <div className="c-app-container__content">
          {this.props.children}
        </div>
        <Modal
          isOpen={this.state.settingsDialogOpen}
          onRequestClose={() => this.closeSettingsDialog()}
          className='c-add-app-dialog'
          overlayClassName='c-add-app-dialog__overlay'
          contentLabel="App Settings">
          <AppSettingsDialog
            title={this.props.appType.constants.TITLE}
            subtitle={this.props.appType.constants.SUBTITLE}
            settingsEditors={this.getSettingsEditors()}
            currentSettings={this.props.appSettings}
            onDone={newSettings => this.onSettingsSave(newSettings)}
            onAppRemove={this.props.onAppRemove} />
        </Modal>
      </div>
    );
  }

  getSettingsEditors() {
    const common = this.props.commonSettingsEditors || [];
    return common;
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

}

AppContainer.propTypes = {
  id: PropTypes.number.isRequired,
  appType: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  maximized: PropTypes.bool,
  appSettings: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: PropTypes.array,
  onAppRemove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired
};

export default AppContainer;
