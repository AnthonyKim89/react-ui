import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import { List } from 'immutable';

import * as api from '../../api';

class DashboardAppAssetSettingEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {assets: List()};
  }

  async componentDidMount() {
    const assets = await api.getAssets(this.props.appType.constants.SUPPORTED_ASSET_TYPES);
    this.setState({assets});
  }

  render() {
    return (
      <FormControl
        componentClass="select"
        placeholder="Select"
        value={this.props.value}
        onChange={e => this.onChange(e)}>
        {this.state.assets.map(asset =>
          <option value={asset.get('id')} key={asset.get('id')}>
            {asset.get('name')}
          </option>
        )}
      </FormControl>
    );
  }

  onChange(event) {
    const val = parseInt(event.target.value, 10);
    this.props.onChange(val);
  }

}

DashboardAppAssetSettingEditor.propTypes = {
  appType: PropTypes.object.isRequired,
  currentValue: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default DashboardAppAssetSettingEditor;