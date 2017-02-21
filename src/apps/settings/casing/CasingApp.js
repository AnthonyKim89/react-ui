import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import CasingViewer from './CasingViewer';
import CasingEditor from './CasingEditor';

import './CasingApp.css';

class CasingApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      casing: this.makeNewCasing(),
      editingCasing: null
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.loadCasing(this.props.asset);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadCasing(newProps.asset)
    }
  }

  async loadCasing(asset) {
    const casing = await api.getAppStorage('corva.data', 'casing', asset.get('id'), Map({limit: 1}));
    this.setState({
      casing: casing.first() || this.makeNewCasing()
    });
  }

  render() {
    return <div className="c-casing">
      {this.state.editingCasing ?
        <CasingEditor casing={this.state.editingCasing}
                      onAddItem={(...a) => this.addItem(...a)}
                      onDeleteItem={(...a) => this.deleteItem(...a)}
                      onItemFieldChange={(...a) => this.updateItemField(...a)}
                      onSave={() => this.save()}
                      onCancel={() => this.setState({editingCasing: null})} /> :
        <CasingViewer casing={this.state.casing}
                      onEdit={() => this.edit()} />}
    </div>;
  }

  edit() {
    this.setState({editingCasing: this.state.casing});
  }

  makeNewCasing() {
    return Map({
      asset_id: this.props.asset.get('id'),
      data: Map({
        items: List()
      })
    });
  }

  addItem() {
    const newItem = Map({
      id: 0,
      od: 0,
      measured_depth_bottom: 0,
      measured_depth_top: 0,
      length: 0,
      linear_mass: 0,
      grade: ''
    });
    this.setState({
      editingCasing: this.state.editingCasing.updateIn(['data', 'items'], i => i.push(newItem))
    });
  }

  deleteItem(index) {
    this.setState({
      editingCasing: this.state.editingCasing.deleteIn(['data', 'items', index])
    });
  }

  updateItemField(idx, name, value) {
    const withFieldUpdated = this.state.editingCasing.setIn(['data', 'items', idx, name], value);
    const newLength = withFieldUpdated.getIn(['data', 'items', idx, 'measured_depth_bottom']) -
                      withFieldUpdated.getIn(['data', 'items', idx, 'measured_depth_top']);
    const withLengthUpdated = withFieldUpdated.setIn(['data', 'items', idx, 'length'], newLength);
    this.setState({
      editingCasing: withLengthUpdated
    });
  }


  async save() {
    const casing = this.state.editingCasing;
    this.setState({editingCasing: null});
    const savedCasing = casing.has('_id') ?
      await api.putAppStorage('corva.data', 'casing', casing.get('_id'), casing) :
      await api.postAppStorage('corva.data', 'casing', casing);
    this.setState({casing: savedCasing});
  }

}

CasingApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default CasingApp;
