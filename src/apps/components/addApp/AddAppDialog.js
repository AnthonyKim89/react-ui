import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Icon } from 'react-materialize';

import AddAppDialogListing from './AddAppDialogListing';
import AddAppDialogDetails from './AddAppDialogDetails';

import './AddAppDialog.css';

class AddAppDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {selectedAppType: null};
  }

  render() {
    return <div className="c-add-app-dialog">
      {this.state.selectedAppType ?
        <AddAppDialogDetails 
          appType={this.state.selectedAppType}
          appTypeCategory={this.getSelectedAppTypeCategory()}
          commonSettingsEditors={this.props.commonSettingsEditors}
          onAppAdd={this.props.onAppAdd} /> :
        <AddAppDialogListing
          appTypes={this.props.appTypes}
          onSelectType={selectedAppType => this.setState({selectedAppType})} />}
      <Button className="c-add-app-dialog__close-button" onClick={this.props.onClose}>
        <Icon>close</Icon> <span>Cancel</span>
      </Button>
    </div>;
  }

  getSelectedAppTypeCategory() {
    const cat = this.props.appTypes
      .findEntry((v, k) => v.get('appTypes').includes(this.state.selectedAppType));
    return cat[1].get('title');
  }
}

AddAppDialog.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  onAppAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddAppDialog;