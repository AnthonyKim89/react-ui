import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-materialize';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isEqual } from 'lodash';

import './AppSettingsDialog.css';

const TABS = {
  SETTINGS: 'settings',
  APP_DETAILS: 'appDetails',
  REMOVE: 'remove'
};

class AppSettingsDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: TABS.SETTINGS,
      settings: props.currentSettings
    };
    this.tabRenderers = {};
    this.tabRenderers[TABS.SETTINGS] = this.renderSettings.bind(this);
    this.tabRenderers[TABS.APP_DETAILS] = this.renderAppDetails.bind(this);
    this.tabRenderers[TABS.REMOVE] = this.renderRemove.bind(this);
  }

  render() {
    return <div className="c-app-settings">
      <header>
        <Button className="c-app-settings__done" onClick={() => this.onDone()}>
          Save
        </Button>
        <h4 className="c-app-settings__title">
          {this.props.appType.constants.METADATA.settingsTitle} Settings
        </h4>
        {this.props.appType.constants.METADATA.subtitle &&
          <h5 className="c-app-settings__subtitle">{this.props.appType.constants.METADATA.subtitle}</h5>}
        <ul className="c-app-settings__tabs">
          <li>
            <Button
              className={this.isActiveTab(TABS.SETTINGS) ?
                "c-app-settings__tab-btn" :
                "c-app-settings__tab-btn btn-flat"}
              onClick={() => this.handleTabClick(TABS.SETTINGS)}
            >Settings</Button>
          </li>
          <li>
            <Button
              className={this.isActiveTab(TABS.APP_DETAILS) ?
                "c-app-settings__tab-btn" :
                "c-app-settings__tab-btn btn-flat"}
              onClick={() => this.handleTabClick(TABS.APP_DETAILS)}
            >App Details</Button>
          </li>
          <li>
            <Link to={this.appPageUrl}>
              <Button className="c-app-settings__tab-btn btn-flat">View App Page</Button>
            </Link>
          </li>
          <li>
            <Button
              className={this.isActiveTab(TABS.REMOVE) ?
                "c-app-settings__tab-btn red" :
                "c-app-settings__tab-btn btn-flat red-text"}
              onClick={() => this.handleTabClick(TABS.REMOVE)}
            >Remove App</Button>
          </li>
        </ul>
      </header>
      <Row className="c-app-settings__grid">
        <Col s={12}>
          {this.renderTab()}
        </Col>
      </Row>
    </div>;
  }

  onDone() {
    this.props.onDone(this.state.settings);
  }

  handleTabClick(newTab) {
    if (this.isActiveTab(newTab)) {
      return;
    }
    this.setState({activeTab: newTab});
  }

  isActiveTab(tab) {
    return this.state.activeTab === tab;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only render when the state changes. shouldComponentUpdate will be called 
    // frequently when the parent app receives new subscription data. But, we 
    // don't want to update the settings page.
    return !isEqual(nextState, this.state);
  }

  renderTab() {
    return this.tabRenderers[this.state.activeTab]();
  }

  renderSettings() {
    return this.props.settingsEditors.map(editor => {
      const name = editor.get('name');
      const title = editor.get('title');
      const Editor = editor.get('Editor');
      return (
        <div className="c-app-settings__editor" key={name}>
          <h5>{title}</h5>
          <Editor
            inSettingsEditor={true}
            currentValue={this.state.settings.get(name)}
            onChange={v => this.setState({settings: this.state.settings.set(name, v)})}
            appType={this.props.appType} />
        </div>
      );
    });
  }

  renderAppDetails() {
    return (
      <div className="c-app-settings__description">
        {this.props.appType.constants.METADATA.description ?
          this.props.appType.constants.METADATA.description :
          "No description is available for this app."}
      </div>
    );
  }

  renderRemove() {
    return (
      <div className="c-app-settings__description">
        <h6>Do you want to remove this app?</h6>
        <Button
          className="red"
          onClick={this.props.onAppRemove}>
          Remove App
        </Button>
      </div>
    );
  }

  get appPageUrl() {
    return `/apps/${this.props.appType.constants.CATEGORY}/${this.props.appType.constants.NAME}`;
  }
}

AppSettingsDialog.propTypes = {
  appType: PropTypes.object.isRequired,
  settingsEditors: ImmutablePropTypes.list.isRequired,
  currentSettings: ImmutablePropTypes.map.isRequired,
  onDone: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
};

export default AppSettingsDialog;
