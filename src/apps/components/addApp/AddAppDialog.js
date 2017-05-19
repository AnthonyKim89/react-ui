import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Icon } from 'react-materialize';
import { isEqual } from 'lodash';

import AddAppDialogListing from './AddAppDialogListing';
import AddAppDialogDetails from './AddAppDialogDetails';

import './AddAppDialog.css';

class AddAppDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAppType: props.selectedAppType || null
    };
  }

  render() {
    return (
      <div className="c-add-app-dialog">
        {this.state.selectedAppType ?
          <AddAppDialogDetails 
            appType={this.state.selectedAppType}
            appTypeCategory={this.getSelectedAppTypeCategory()}
            commonSettingsEditors={this.props.commonSettingsEditors}
            showSettings={this.props.showSettings}
            onAppAdd={this.props.onAppAdd}
            onViewAllApps={() => this.showAppList()} /> :
          <AddAppDialogListing
            appTypes={this.props.appTypes}
            onSelectType={selectedAppType => this.showAppDetails(selectedAppType)} />}
        {this.props.showCancel &&
          <Button className="c-add-app-dialog__close-button" onClick={this.props.onClose}>
            <Icon>close</Icon> <span>Cancel</span>
          </Button>
        }
      </div>
    );
  }

  getSelectedAppTypeCategory() {
    const cat = this.props.appTypes
      .findEntry((v, k) => v.get('appTypes').includes(this.state.selectedAppType));
    return cat[1].get('title');
  }

  showAppList() {
    this.setState({selectedAppType: null});
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  showAppDetails(selectedAppType) {
    this.setState({selectedAppType: selectedAppType});
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only render when the state changes. shouldComponentUpdate will be called 
    // frequently when the parent app receives new subscription data. But, we 
    // don't want to update the settings page.
    return !isEqual(nextState, this.state);
  }
}

AddAppDialog.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  // The AddAppDialog can be initialized with a starting app type.
  selectedAppType: PropTypes.object,
  commonSettingsEditors: ImmutablePropTypes.list,
  onAppAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showCancel: PropTypes.bool,
  showSettings: PropTypes.bool
};

AddAppDialog.defaultProps = {
  showCancel: true,
  showSettings: true
};

export default AddAppDialog;
