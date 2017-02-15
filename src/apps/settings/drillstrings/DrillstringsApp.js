import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import DrillstringBrowser from './DrillstringBrowser';
import DrillstringEditor from './DrillstringEditor';

import './DrillstringsApp.css';

class DrillstringsApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drillstrings: List(),
      editingDrillstring: null
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.loadDrillstrings(this.props.asset);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadDrillstrings(newProps.asset)
    }
  }

  async loadDrillstrings(asset) {
    const drillstrings = await api.getAppStorage('corva.data', 'drillstrings', asset.get('id'));
    this.setState({drillstrings});
  }

  render() {
    return <div className="c-drillstrings">
      {this.state.editingDrillstring ?
        <DrillstringEditor
          drillstring={this.state.editingDrillstring}
          onSave={drillstring => this.setState({editingDrillstring: null})}
          onCancel={() => this.setState({editingDrillstring: null})} /> :
        <DrillstringBrowser
          drillstrings={this.state.drillstrings}
          onNewDrillstring={() => this.setState({editingDrillstring: Map()})} />}
    </div>;
  }

}

DrillstringsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DrillstringsApp;
