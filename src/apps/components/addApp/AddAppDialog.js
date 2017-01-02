import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Glyphicon } from 'react-bootstrap';

import AddAppDialogListing from './AddAppDialogListing';

import './AddAppDialog.css';

class AddAppDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="c-add-app-dialog">
      <AddAppDialogListing
        appTypes={this.props.appTypes}
        onSelectType={this.props.onAppAdd} />
      <Button bsStyle="link" className="c-add-app-dialog__close-button" onClick={this.props.onClose}>
        <Glyphicon glyph="remove" />
      </Button>
    </div>;
  }

}

AddAppDialog.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  onAppAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddAppDialog;