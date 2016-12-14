import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './AppSettingsDialog.css';

class AppSettingsDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {settings: props.currentSettings};
  }

  render() {
    return <div className="c-app-settings">
      <header>
        <Button className="c-app-settings__done" bsStyle="primary" onClick={() => this.onDone()}>
          Save
        </Button>
        <h4 className="c-app-settings__title">
          {this.props.title} Settings
        </h4>
        {this.props.subtitle &&
          <h5 className="c-app-settings__subtitle">{this.props.subtitle}</h5>}
      </header>
      <div className="c-app-settings__columns">
        <div className="c-app-settings__column c-app-settings__column--left">
          {this.props.settingsEditors.map(({name, title, Editor}) =>
            <div className="c-app-settings__editor" key={name}>
              <h5>{title}</h5>
              <Editor
                value={this.state.settings.get(name)}
                onChange={v => this.setState({settings: this.state.settings.set(name, v)})} />
            </div>
          )}
        </div>
        <div className="c-app-settings__column c-app-settings__column--right">
          <Button onClick={this.props.onAppRemove} bsStyle="warning" block>
            <Glyphicon glyph="remove" /> Remove App
          </Button>
        </div>
      </div>
    </div>
  }

  onDone() {
    this.props.onDone(this.state.settings);
  }

}

AppSettingsDialog.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  settingsEditors: PropTypes.array.isRequired,
  currentSettings: ImmutablePropTypes.map.isRequired,
  onDone: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
};

export default AppSettingsDialog;