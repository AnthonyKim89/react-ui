import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';
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
        <Button className="c-app-settings__done" onClick={() => this.onDone()}>
          Save
        </Button>
        <h4 className="c-app-settings__title">
          {this.props.appType.constants.METADATA.settingsTitle} Settings
        </h4>
        {this.props.appType.constants.METADATA.subtitle &&
          <h5 className="c-app-settings__subtitle">{this.props.appType.constants.METADATA.subtitle}</h5>}
      </header>
      <Row className="c-app-settings__grid">
          <Col s={6}>
            {this.props.settingsEditors.map(editor => {
              const name = editor.get('name');
              const title = editor.get('title');
              const Editor = editor.get('Editor');
              return <div className="c-app-settings__editor" key={name}>
                <h5>{title}</h5>
                <Editor
                  inSettingsEditor={true}
                  currentValue={this.state.settings.get(name)}
                  onChange={v => this.setState({settings: this.state.settings.set(name, v)})}
                  appType={this.props.appType} />
              </div>;
            })}
          </Col>
          <Col s={6}>
            <div className="c-app-settings__editor">
              <Button className="grey white-text" onClick={this.props.onAppRemove}>
                <Icon>delete</Icon> <span>Remove Widget</span>
              </Button>
            </div>
          </Col>
      </Row>
    </div>;
  }

  onDone() {
    this.props.onDone(this.state.settings);
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