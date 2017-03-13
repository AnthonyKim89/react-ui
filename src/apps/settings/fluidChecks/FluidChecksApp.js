import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import FluidChecksBrowser from './FluidChecksBrowser';
import FluidChecksEditor from './FluidChecksEditor';

import './FluidChecksApp.css';

class FluidChecksApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fluidChecks: List(),
      displayingFluidCheck: null,
      editingFluidCheck: null
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.loadFluidChecks(this.props.asset);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadFluidChecks(newProps.asset)
    }
  }

  async loadFluidChecks(asset) {
    const fluidChecks = await api.getAppStorage('corva', 'data.mud', asset.get('id'), Map({limit: 0}));
    this.setState({
      fluidChecks,
      displayingFluidCheck: fluidChecks.first()
    });
  }

  render() {
    return <div className="c-fluid-checks">
      {this.state.editingFluidCheck ?
        <FluidChecksEditor
          fluidCheck={this.state.editingFluidCheck}
          onSave={fluidCheck => this.saveFluidCheck(fluidCheck)}
          onCancel={() => this.setState({editingFluidCheck: null})}
          onDeleteFluidCheck={() => this.deleteFluidCheck()} /> :
        <FluidChecksBrowser
          fluidChecks={this.state.fluidChecks}
          displayingFluidCheck={this.state.displayingFluidCheck}
          onSelectFluidCheck={ds => this.setState({displayingFluidCheck: ds})}
          onNewFluidCheck={() => this.setState({editingFluidCheck: this.makeNewFluidCheck()})}
          onEditFluidCheck={() => this.setState({editingFluidCheck: this.state.displayingFluidCheck})}
          onDeleteFluidCheck={() => this.deleteFluidCheck()} />}
    </div>;
  }

  makeNewFluidCheck() {
    return Map({
      asset_id: this.props.asset.get('id'),
      data: Map({
      })
    });
  }

  async saveFluidCheck(fluidCheck) {
    this.setState({editingFluidCheck: null});
    const savedCheck = fluidCheck.has('_id') ?
      await api.putAppStorage('corva', 'data.mud', fluidCheck.get('_id'), fluidCheck) :
      await api.postAppStorage('corva', 'data.mud', fluidCheck);
    this.setState({
      fluidChecks: this.state.fluidChecks
        .filterNot(f => f.get('_id') === savedCheck.get('_id'))
        .push(savedCheck)
        .sortBy(ds => ds.get('_id')),
      displayingFluidCheck: savedCheck
    });
  }

  async deleteFluidCheck() {
    const fluidCheck = this.state.editingFluidCheck || this.state.displayingFluidCheck;
    await api.deleteAppStorage('corva', 'data.mud', fluidCheck.get('_id'));
    const fluidChecksAfterDelete = this.state.fluidChecks
      .filterNot(ds => ds.get('_id') === fluidCheck.get('_id'));
    this.setState({
      fluidChecks: fluidChecksAfterDelete,
      editingFluidCheck: null,
      displayingFluidCheck: fluidChecksAfterDelete.first()
    });
  }

}

FluidChecksApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default FluidChecksApp;
