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
      displayingDrillstring: null,
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
    const drillstrings = await api.getAppStorage('corva.data', 'drillstrings', asset.get('id'), Map({limit: 0}));
    this.setState({
      drillstrings,
      displayingDrillstring: drillstrings.first()
    });
  }

  render() {
    return <div className="c-drillstrings">
      {this.state.editingDrillstring ?
        <DrillstringEditor
          drillstring={this.state.editingDrillstring}
          onSave={drillstring => this.saveDrillstring(drillstring)}
          onCancel={() => this.setState({editingDrillstring: null})}
          onDeleteDrillstring={() => this.deleteDrillstring()} /> :
        <DrillstringBrowser
          drillstrings={this.state.drillstrings}
          displayingDrillstring={this.state.displayingDrillstring}
          onSelectDrillstring={ds => this.setState({displayingDrillstring: ds})}
          onNewDrillstring={() => this.setState({editingDrillstring: this.makeNewDrillstring()})}
          onEditDrillstring={() => this.setState({editingDrillstring: this.state.displayingDrillstring})}
          onDeleteDrillstring={() => this.deleteDrillstring()} />}
    </div>;
  }

  makeNewDrillstring() {
    return Map({
      asset_id: this.props.asset.get('id'),
      data: Map({
        components: List()
      })
    });
  }

  async saveDrillstring(drillstring) {
    this.setState({editingDrillstring: null});
    const savedString = drillstring.has('_id') ?
      await api.putAppStorage('corva.data', 'drillstrings', drillstring.get('_id'), drillstring) :
      await api.postAppStorage('corva.data', 'drillstrings', drillstring);
    this.setState({
      drillstrings: this.state.drillstrings
        .filterNot(ds => ds.getIn(['data', 'id']) === savedString.getIn(['data', 'id']))
        .push(savedString)
        .sortBy(ds => ds.getIn(['data', 'id'])),
      displayingDrillstring: savedString
    });
  }

  async deleteDrillstring() {
    const drillstring = this.state.editingDrillstring || this.state.displayingDrillstring;
    console.log('deleting', drillstring.toJS());
    await api.deleteAppStorage('corva.data', 'drillstrings', drillstring.get('_id'));
    const drillstringsAfterDelete = this.state.drillstrings
      .filterNot(ds => ds.get('_id') === drillstring.get('_id'));
    this.setState({
      drillstrings: drillstringsAfterDelete,
      editingDrillstring: null,
      displayingDrillstring: drillstringsAfterDelete.first()
    });
  }

}

DrillstringsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DrillstringsApp;
