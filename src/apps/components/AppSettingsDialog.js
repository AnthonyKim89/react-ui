import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import './AppSettingsDialog.css';

class AppSettingsDialog extends Component {

  render() {
    return <div className="c-app-settings">
      <header>
        <Button className="c-app-settings__done" bsStyle="primary" onClick={this.props.onDone}>
          Save
        </Button>
        <h4 className="c-app-settings__title">
          {this.props.appType.constants.TITLE} Settings
        </h4>
        {this.props.appType.constants.SUBTITLE &&
          <h5 className="c-app-settings__subtitle">{this.props.appType.constants.SUBTITLE}</h5>}
      </header>
      <div className="c-app-settings__columns">
        <div className="c-app-settings__column c-app-settings__column--left">
        </div>
        <div className="c-app-settings__column c-app-settings__column--right">
          <Button onClick={this.props.onAppRemove} bsStyle="warning" block>
            <Glyphicon glyph="remove" /> Remove App
          </Button>
        </div>
      </div>
    </div>
  }

}

AppSettingsDialog.propTypes = {
  appType: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
};

export default AppSettingsDialog;