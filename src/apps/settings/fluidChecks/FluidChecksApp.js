import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { format as formatTime } from 'date-fns';

import SettingsRecordManager from '../components/SettingsRecordManager';

import FluidCheckSummary from './FluidCheckSummary';
import FluidCheckAttributeForm from './FluidCheckAttributeForm';
import FluidCheckRheometerReadings from './FluidCheckRheometerReadings';

import { FLUID_CHECK_DATA_TEMPLATE } from './constants';

class FluidChecksApp extends Component {

  render() {
    return <SettingsRecordManager
              asset={this.props.asset}
              recordDevKey="corva"
              recordCollection="data.mud"
              recordNamePlural="Fluid Checks"
              recordNameSingular="Fluid Check"
              recordDataTemplate={FLUID_CHECK_DATA_TEMPLATE}
              RecordSummary={FluidCheckSummary}
              RecordAttributeForm={FluidCheckAttributeForm}
              RecordDetails={FluidCheckRheometerReadings}
              renderRecordListItem={r => this.renderFluidCheckListItem(r)} />
  }

  renderFluidCheckListItem(fluidCheck) {
    const timestamp = formatTime(fluidCheck.get('timestamp') * 1000, 'ddd MMM Do YYYY');
    return `Date ${timestamp}`;
  }

}

FluidChecksApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default FluidChecksApp;
