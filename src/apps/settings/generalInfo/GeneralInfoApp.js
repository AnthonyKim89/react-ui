import React, { Component, PropTypes } from 'react';
import { Button, Col, Row, Input } from 'react-materialize';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';

import './GeneralInfoApp.css';

class GeneralInfoApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      asset: props.asset || Map({name: ''}),
      rigs: List()
    };
    console.log('asset', this.state.asset.toJS());
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
    return <div className="c-general-info">
      <h4>General Info</h4>
      <Row>
        <Input m={4}
               type="text"
               label="Well Name"
               value={this.state.asset.get('name')}
               onChange={e => this.setName(e.target.value)} />
      </Row>
      <Row>
        <Input m={4}
               type="select"
               label="Rig"
               value={this.state.asset.get('parent_asset_id')}
               onChange={e => this.setParentAssetId(e.target.value)}>
          {this.state.rigs.map(rig =>
            <option key={rig.get('id')} value={rig.get('id')}>
              {rig.get('name')}
            </option>)}
        </Input>
      </Row>
      <Row>
        <Col m={12}>
          <Button onClick={() => this.saveChanges()}
                  disabled={this.state.asset.equals(this.props.asset)}>
            Save changes
          </Button>
        </Col>
      </Row>
    </div>;
  }

  setName(name) {
    this.setState({
      asset: this.state.asset.set('name', name)
    });
  }

  setParentAssetId(id) {
    this.setState({
      asset: this.state.asset.set('parent_asset_id', parseInt(id, 10))
    });
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