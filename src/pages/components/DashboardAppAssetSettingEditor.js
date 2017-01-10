import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
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
    return (
      <FormControl
        componentClass="select"
        placeholder="Select"
        value={this.props.currentValue}
        disabled={this.state.loading}
        onChange={e => this.onChange(e)}>
        <option value={undefined}>
          {this.state.loading && 'Loading...'}
        </option>
        {this.state.assets.map(asset =>
          <option value={asset.get('id')} key={asset.get('id')}>
            {asset.get('name')}
          </option>
        )}
      </FormControl>
    );
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

}

DashboardAppAssetSettingEditor.propTypes = {
  appType: PropTypes.object.isRequired,
  currentValue: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default DashboardAppAssetSettingEditor;