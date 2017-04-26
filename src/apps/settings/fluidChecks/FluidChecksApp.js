import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { format as formatTime } from 'date-fns';

import SettingsRecordManager from '../components/SettingsRecordManager';

import FluidCheckSummary from './FluidCheckSummary';
import FluidCheckAttributeForm from './FluidCheckAttributeForm';
import FluidCheckViscosity from './FluidCheckViscosity';

import { FLUID_CHECK_DATA_TEMPLATE,METADATA } from './constants';

class FluidChecksApp extends Component {
  render() {        
    return <SettingsRecordManager
              asset={this.props.asset}
              convert={this.props.convert}
              recordProvider="corva"
              recordCollection="data.mud"
              recordNamePlural="Fluid Checks"
              recordNameSingular="Fluid Check"
              recordValidator={this.validator.bind(this)}
              hideRecordSummaryInRecordEditor={true}
              title={METADATA.title}
              subtitle={METADATA.subtitle}
              recordDataTemplate={FLUID_CHECK_DATA_TEMPLATE}
              RecordSummary={FluidCheckSummary}
              RecordAttributeForm={FluidCheckAttributeForm}
              RecordDetails={FluidCheckViscosity}
              renderRecordListItem={r => this.renderFluidCheckListItem(r)} />;
  }

  validator(recordData) {
    let {data: {mud_density, mud_cake_thickness, filterate, ph, viscocity:{pv,yp,marsh_funnel,rpm_readings}}} = recordData.toJS();
    let hasFormErrors = false;
    let errors = {};
    if (!this.isValueValid(mud_density,5,20,false)) {
      hasFormErrors = true;
      errors["mud_density"] = this.generateRangeErrorMessage(5,20);
    }

    if (!this.isValueValid(mud_cake_thickness,0,20,true)) {
      hasFormErrors = true;
      errors["mud_cake_thickness"] = this.generateRangeErrorMessage(0,20);
    }

    if (!this.isValueValid(filterate,0,1000,true)) {
      hasFormErrors = true;
      errors["filterate"] = this.generateRangeErrorMessage(0,1000);
    }

    if (!this.isValueValid(ph,5,10,true)) {
      hasFormErrors = true;
      errors["ph"] = this.generateRangeErrorMessage(5,10);
    }

    if ((this.isValueEmpty(pv) || this.isValueEmpty(yp)) && rpm_readings.length<2) {
      hasFormErrors = true;
      errors["rpm_readings_required"] = "At least 2 paris of rpm and dial_reading required.";
    }

    if (!this.isValueValid(pv,0,200,!errors["rpm_readings_required"])) {
      hasFormErrors = true;
      errors["pv"] = this.generateRangeErrorMessage(0,200);
    }

    if (!this.isValueValid(yp,0,100,!errors["rpm_readings_required"])) {
      hasFormErrors = true;
      errors["yp"] = this.generateRangeErrorMessage(0,100);
    }

    if (!this.isValueValid(marsh_funnel,5,150,true)) {
      hasFormErrors = true;
      errors["marsh_funnel"] = this.generateRangeErrorMessage(5,150);
    }

    errors["rpm_readings"] = [];

    for (let i=0; i<rpm_readings.length; i++) {
      errors["rpm_readings"][i] = {};
      if (!this.isValueValid(rpm_readings[i].rpm,0,1000,true)) {
        hasFormErrors= true;        
        errors["rpm_readings"][i]["rpm"] = this.generateRangeErrorMessage(0,1000);
      }
      if (!this.isValueValid(rpm_readings[i].dial_reading,0,150,true)) {
        hasFormErrors= true;
        errors["rpm_readings"][i]["dial_reading"] = this.generateRangeErrorMessage(0,150);
      }
    }

    if (hasFormErrors) {
      return errors;
    }
    return null;
  }

  generateRangeErrorMessage(min, max) {
    let isValueEmpty = this.isValueEmpty;
    if (!isValueEmpty(min) && isValueEmpty(max)) {
      return `It should be greater than ${min}`;
    }
    else if (!isValueEmpty(max) && isValueEmpty(min)) {
      return `It should be less than ${max}`;
    }
    else if (!isValueEmpty(min) && !isValueEmpty(max)) {
      return `It should be in range ${min} ~ ${max}`;
    }
    else {
      // sould not reache here;
    }
  }
 
  isValueEmpty(val) {
    if (val === null || typeof val === "undefined" || val==="") {
      return true;
    }
    return false;
  }

  isValueValid(val,min,max,emptyAllowed) {
    if (this.isValueEmpty(val)) {
      if (emptyAllowed) {
        return true;
      }
      return false;
    }
    
    val = parseFloat(val);
    if (isNaN(val) || val<min || val>max) {
      return false;
    }

    return true;

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
