import React, { Component, PropTypes } from 'react';
import { Input } from 'react-materialize';
import { List } from 'immutable';

import * as api from '../../api';

class DashboardAppAssetSettingEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {assets: List(), loading: false};
  }

  async componentDidMount() {
    this.setState({loading: true});
    const assets = await api.getAssets(this.props.appType.constants.SUPPORTED_ASSET_TYPES);
    this.setState({assets, loading: false});
  }

  render() {
    if (this.props.inSettingsEditor) {
      return this.renderForSettingsDialog();
    } else {
      return this.defaultRender();
    }
  }

  defaultRender() {
    return (
      <Input
        type="select"
        value={this.props.currentValue}
        disabled={this.state.loading}
        onChange={e => this.onChange(e)}>
        { this.renderLabel() }
        {this.state.assets.map(asset =>
          <option value={asset.get('id')} key={asset.get('id')}>
            {asset.get('name')}
          </option>
        )}
      </Input>
    );
  }

  // When we render for the settings dialog, we use some custom coloring and no empty default option
  renderForSettingsDialog() {
    return (
      <Input
        className="grey lighten-2 black-text"
        type="select"
        value={this.props.currentValue}
        disabled={this.state.loading}
        onChange={e => this.onChange(e)}>
        { this.renderLabel() }
        {this.state.assets.map(asset =>
          <option className="grey lighten-2 black-text" value={asset.get('id')} key={asset.get('id')}>
            {asset.get('name')}
          </option>
        )}
      </Input>
    );
  }

  renderLabel() {
    return (this.props.isLabelVisible || true) ? 
    <option value="" disabled defaultValue="true">{this.props.label || "Choose An Asset"}</option>
    : "";
  }

  onChange(event) {
    const id = event.target.value && parseInt(event.target.value, 10);
    this.props.onChange(id);
  }

}

DashboardAppAssetSettingEditor.propTypes = {
  appType: PropTypes.object.isRequired,
  currentValue: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  inSettingsEditor: PropTypes.bool,
  label: PropTypes.string,
  isLabelVisible: PropTypes.bool
};

export default DashboardAppAssetSettingEditor;