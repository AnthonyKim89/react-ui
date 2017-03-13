import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import SettingsRecordManager from '../components/SettingsRecordManager';

import DrillstringSummary from './DrillstringSummary';
import DrillstringAttributeForm from './DrillstringAttributeForm';
import DrillstringComponentTable from './DrillstringComponentTable';

import { DRILLSTRING_DATA_TEMPLATE } from './constants';


class DrillstringsApp extends Component {

  render() {
    return <SettingsRecordManager
              asset={this.props.asset}
              recordDevKey="corva"
              recordCollection="data.drillstrings"
              recordNamePlural="Drillstrings"
              recordNameSingular="Drillstring"
              recordDataTemplate={DRILLSTRING_DATA_TEMPLATE}
              RecordSummary={DrillstringSummary}
              RecordAttributeForm={DrillstringAttributeForm}
              RecordDetails={DrillstringComponentTable}
              renderRecordListItem={r => this.renderDrillstringListItem(r)} />;
  }

  renderDrillstringListItem(ds) {
    return `BHA #${ds.getIn(['data', 'id'])}`;
  }

}

DrillstringsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DrillstringsApp;
