import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';
import Modal from 'react-modal';

import AppSettingsDialog from './AppSettingsDialog';

import './AppContainer.css';

const appSettingsModalStyles = {
  content: {
    top: '20%',
    left: '30%',
    right: '30%',
    bottom: '20%',
    borderRadius: 0,
    padding: '20px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
};

class AppContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {settingsDialogOpen: false};
  }

  render() {
    const classes = {
      'c-app-container': true,
      'c-app-container--maximized': this.props.maximized,
      'c-app-container--with-subtitle': this.props.subtitle
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
        </button> :
        <h4 className="c-app-container__title">{this.props.title}</h4>
        {this.props.subtitle &&
          <h5 className="c-app-container__subtitle">{this.props.subtitle}</h5>}
        <div className="c-app-container__content">
          {this.props.children}
        </div>
        <Modal
          isOpen={this.state.settingsDialogOpen}
          onRequestClose={() => this.closeSettingsDialog()}
          style={appSettingsModalStyles}
          contentLabel="App Settings">
          <AppSettingsDialog onAppRemove={this.props.onAppRemove} />
        </Modal>
      </div>
    );
  }

  openSettingsDialog() {
    this.setState({settingsDialogOpen: true});
  }

  closeSettingsDialog() {
    this.setState({settingsDialogOpen: false});
  }
  
}

AppContainer.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  location: PropTypes.object.isRequired,
  maximized: PropTypes.bool,
  onAppRemove: PropTypes.func.isRequired
};

export default AppContainer;
