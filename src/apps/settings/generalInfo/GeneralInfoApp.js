import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {MuiThemeProvider, getMuiTheme} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import * as api from '../../../api';

import './GeneralInfoApp.css';
import {METADATA} from './constants';

class GeneralInfoApp extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      asset: props.asset,
      rigs: List()
    };
  }

  async componentDidMount() {
    const rigs = await api.getAssets(['rig']);
    this.setState({rigs});
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.setState({asset: newProps.asset});
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="c-general-info">
          {this.state.asset && <div>
            <h4>{METADATA.title}</h4>
            <div>{METADATA.subtitle}</div> 
            <div className="c-general-info__info-block">
              <div>
                <TextField type="text" 
                  floatingLabelText="Well Name"
                  ref="name"
                  value={this.state.asset.get('name')}
                  onChange={e => this.setState({asset: this.state.asset.set('name', e.target.value)} )} />
              </div>
              <div>
                <SelectField
                  floatingLabelText="Rig"
                  ref="rig"
                  value={this.state.asset.get('parent_asset_id')}
                  maxHeight={200}
                  onChange={ (event, index, value) => this.setState({asset: this.state.asset.set('parent_asset_id', parseInt(value, 10))} )}
                  >
                  {
                    this.state.rigs.map(rig => <MenuItem key={rig.get('id')} value={rig.get('id')} primaryText={rig.get('name')}/>)
                  }
                </SelectField>
              </div>
              <div>
                <RaisedButton label="Save Changes" primary={true} disabled={this.state.asset.equals(this.props.asset)} 
                    onClick={() => this.saveChanges()}/>
              </div>
            </div>
          </div>}
        </div>
      </MuiThemeProvider>
    );
  }

  async saveChanges() {
    await api.putAsset(this.state.asset.get('id'), this.state.asset);
    this.props.onAssetModified(this.state.asset);
  }

}

GeneralInfoApp.propTypes = {
  asset: ImmutablePropTypes.map,
  onAssetModified: PropTypes.func.isRequired
};

export default GeneralInfoApp;