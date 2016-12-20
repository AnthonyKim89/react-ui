import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import { List } from 'immutable';

import * as api from '../../api';

const RIG_ASSET_TYPE = 'rig';

class DashboardAppRigSettingEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {rigs: List()};
  }

  async componentDidMount() {
    const rigs = await api.getAssets(RIG_ASSET_TYPE);
    this.setState({rigs});
  }

  render() {
    return <FormControl componentClass="select"
                        placeholder="Select"
                        value={this.props.value}
                        onChange={e => this.onChange(e)}>
      {this.state.rigs.map(rig =>
        <option value={rig.get('id')} key={rig.get('id')}>
          {rig.get('name')}
        </option>
      )}
    </FormControl>;
  }

  onChange(event) {
    const val = parseInt(event.target.value, 10);
    this.props.onChange(val);
  }
}

DashboardAppRigSettingEditor.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default DashboardAppRigSettingEditor;