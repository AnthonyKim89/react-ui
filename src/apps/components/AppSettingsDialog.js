import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

class AppSettingsDialog extends Component {

  render() {
    return <div className="c-app-settings">
      <Button onClick={this.props.onAppRemove}>
        <Glyphicon glyph="remove" /> Remove App
      </Button>
    </div>
  }

}

AppSettingsDialog.propTypes = {
  onAppRemove: PropTypes.func.isRequired 
};

export default AppSettingsDialog;