import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {fromJS} from 'immutable';

import SettingsRecordManager from '../components/SettingsRecordManager';

import DrillstringSummary from './DrillstringSummary';
import DrillstringAttributeForm from './DrillstringAttributeForm';
import DrillstringComponent from './DrillstringComponent';
import { DRILLSTRING_DATA_TEMPLATE, METADATA } from './constants';

const DEF_MIN_ID = 0,
      DEF_MAX_ID =100, 
      DEF_MIN_OD = 1, 
      DEF_MAX_OD = 100, 
      DEF_MIN_LENGTH = 0,
      DEF_MAX_LENGTH = 1000;

const DP_MIN_ID = 1, 
      DP_MAX_ID =7, 
      DP_MIN_OD = 2, 
      DP_MAX_OD = 8, 
      DP_MIN_TJ_ID = 1,
      DP_MAX_TJ_ID = 7,
      DP_MIN_TJ_OD = 2,
      DP_MAX_TJ_OD = 10,
      DP_MIN_LENGTH = 0,
      DP_MAX_LENGTH = 30000;

const HWDP_MIN_ID = 1, 
      HWDP_MAX_ID =7, 
      HWDP_MIN_OD = 2, 
      HWDP_MAX_OD = 8,
      HWDP_MIN_TJ_ID = 1,
      HWDP_MAX_TJ_ID = 7,
      HWDP_MIN_TJ_OD = 2,
      HWDP_MAX_TJ_OD = 10,
      HWDP_MIN_LENGTH = 0,
      HWDP_MAX_LENGTH = 5000;

const DC_MIN_ID = 0.5, 
      DC_MAX_ID =7, 
      DC_MIN_OD = 2, 
      DC_MAX_OD = 13,       
      DC_MIN_LENGTH = 0,
      DC_MAX_LENGTH = 3000;

const STABLE_MIN_ID = 0, 
      STABLE_MAX_ID =100, 
      STABLE_MIN_OD = 1, 
      STABLE_MAX_OD = 100, 
      STABLE_MIN_LENGTH = 0, 
      STABLE_MAX_LENGTH = 100;

const PDM_MIN_OD = 2, 
      PDM_MAX_OD = 13, 
      PDM_MIN_LENGTH = 4, 
      PDM_MAX_LENGTH = 50,

      PDM_MIN_STATOR = 2,
      PDM_MAX_STATOR = 8, 
      PDM_MIN_ROTOR = 1, 
      PDM_MAX_ROTOR = 7, 
      PDM_MIN_RPG = 0, 
      PDM_MAX_RPG = 10,
      PDM_MIN_WOB = 0,
      PDM_MAX_WOB = 70,
      PDM_MIN_FLOW_RANGE = 0,
      PDM_MAX_FLOW_RANGE = 2000,
      PDM_MIN_MODP = 0,
      PDM_MAX_MODP = 2000,
      PDM_MIN_TMODP = 0,
      PDM_MAX_TMODP = 20;

const //MWD_MIN_ID = 0, 
      //MWD_MAX_ID =12, 
      MWD_MIN_OD = 2, 
      MWD_MAX_OD = 13, 
      MWD_MIN_LENGTH = 1.0, 
      MWD_MAX_LENGTH = 200;

const //RSS_MIN_ID = 0, 
      //RSS_MAX_ID =12, 
      RSS_MIN_OD = 2, 
      RSS_MAX_OD = 13, 
      RSS_MIN_LENGTH = 1.0, 
      RSS_MAX_LENGTH = 200;

const BIT_MIN_TFA = 0, 
      BIT_MAX_TFA = 20;

class DrillstringsApp extends Component {

  render() {
    return <SettingsRecordManager
              asset={this.props.asset}
              convert={this.props.convert}
              recordProvider="corva"
              recordCollection="data.drillstring"
              recordNamePlural="Drillstrings"
              recordNameSingular="Drillstring"
              convertRecordBackToImperialUnit={this.convertRecordBackToImperialUnit.bind(this)}
              hideRecordSummaryInRecordEditor={false}
              title={METADATA.title}
              subtitle={METADATA.subtitle}
              recordValidator={this.validator.bind(this)}
              recordDataTemplate={DRILLSTRING_DATA_TEMPLATE}
              RecordSummary={DrillstringSummary}
              RecordAttributeForm={DrillstringAttributeForm}
              RecordDetails={DrillstringComponent}
              renderRecordListItem={r => this.renderDrillstringListItem(r)} />;
  }

  renderDrillstringListItem(ds) {
    return `BHA #${ds.getIn(['data', 'id'])}`;
  }

  isValueEmpty(val) {
    if (val === null || typeof val === "undefined" || val==="") {
      return true;
    }
    return false;
  }

  isValidNumber(num,min,max) {
    num = parseFloat(num);
    if (isNaN(num)) {
      return false;
    }

    if (min && num<min) {
      return false;
    }

    if (max && num>max) {
      return false;
    }

    return true;
  }

  deriveLinearWeight(id,od) {
    return 2.673*(od*od-id*id);
  }

  isValidLinearWeight(id,od,linearWeight) {    
    let estimated = this.deriveLinearWeight(id,od);
    if (linearWeight >= estimated* 0.7 && linearWeight<= estimated*1.3) {
      return true;
    }
    return false;
  }

  validator(recordData) {
    let {data: {id, components }} = recordData.toJS();
    let shortLengthUnitDisplay = this.props.convert.getUnitDisplay('shortLength');
    let lengthUnitDisplay = this.props.convert.getUnitDisplay('length');
    let hasFormErrors = false;
    let errors = {};
    let bitFamilyCount = 0;    
    errors["components"] = {};
    errors["specificErrors"] = {};

    if (this.isValueEmpty(id)) {
      errors["id"] = "It should not be empty.";
      hasFormErrors = true;
    }

    for (let i=0; i < components.length; i++) {
      let min_id,min_od,max_id,max_od,min_length,max_length,min_tj_id,max_tj_id,min_tj_od,max_tj_od;
      let comp = components[i];
      let error = {};
      switch(comp.family) {

        case 'dp':
          min_id = this.props.convert.convertValue(DP_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DP_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DP_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DP_MAX_OD,"shortLength","in");
          min_tj_id = this.props.convert.convertValue(DP_MIN_TJ_ID,"shortLength","in");
          max_tj_id = this.props.convert.convertValue(DP_MAX_TJ_ID,"shortLength","in");
          min_tj_od = this.props.convert.convertValue(DP_MIN_TJ_OD,"shortLength","in");
          max_tj_od = this.props.convert.convertValue(DP_MAX_TJ_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DP_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DP_MAX_LENGTH,"length","ft");          
          break;

        case 'hwdp':
          min_id = this.props.convert.convertValue(HWDP_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(HWDP_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(HWDP_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(HWDP_MAX_OD,"shortLength","in");
          min_tj_id = this.props.convert.convertValue(HWDP_MIN_TJ_ID,"shortLength","in");
          max_tj_id = this.props.convert.convertValue(HWDP_MAX_TJ_ID,"shortLength","in");
          min_tj_od = this.props.convert.convertValue(HWDP_MIN_TJ_OD,"shortLength","in");
          max_tj_od = this.props.convert.convertValue(HWDP_MAX_TJ_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(HWDP_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(HWDP_MAX_LENGTH,"length","ft");
          break;

        case 'dc':
          min_id = this.props.convert.convertValue(DC_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DC_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DC_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DC_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DC_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DC_MAX_LENGTH,"length","ft");
          break;

        case 'stabilizer':
          min_id = this.props.convert.convertValue(STABLE_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(STABLE_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(STABLE_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(STABLE_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(STABLE_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(STABLE_MAX_LENGTH,"length","ft");
          break;

        case 'pdm':
          min_od = this.props.convert.convertValue(PDM_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(PDM_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(PDM_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(PDM_MAX_LENGTH,"length","ft");
          break;

        case 'mwd':
          min_od = this.props.convert.convertValue(MWD_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(MWD_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(MWD_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(MWD_MAX_LENGTH,"length","ft");
          break;

        case 'bit':          
          bitFamilyCount++;
          break;

        case 'rss':
          min_od = this.props.convert.convertValue(RSS_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(RSS_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(RSS_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(RSS_MAX_LENGTH,"length","ft");
          break;

        default:
          min_id = this.props.convert.convertValue(DEF_MIN_ID,"shortLength","in");
          max_id = this.props.convert.convertValue(DEF_MAX_ID,"shortLength","in");
          min_od = this.props.convert.convertValue(DEF_MIN_OD,"shortLength","in");
          max_od = this.props.convert.convertValue(DEF_MAX_OD,"shortLength","in");
          min_length = this.props.convert.convertValue(DEF_MIN_LENGTH,"length","ft");
          max_length = this.props.convert.convertValue(DEF_MAX_LENGTH,"length","ft");
          break;
      }

      if (!this.isValueEmpty(min_id) && !this.isValueEmpty(min_od)) {
        if (!this.isValidNumber(comp.inner_diameter,min_id,max_id)) {
          error["inner_diameter"] = `${min_id}~${max_id} (${shortLengthUnitDisplay})`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.outer_diameter,min_od,max_od)) {
          error["outer_diameter"] = `${min_od}~${max_od} (${shortLengthUnitDisplay})`;
          hasFormErrors = true;
        }

        if (this.isValidNumber(comp.inner_diameter,min_id,max_id) && this.isValidNumber(comp.outer_diameter,min_od,max_od) && !this.isValidNumber(comp.inner_diameter,min_id,comp.outer_diameter)) {
          error["outer_diameter"] = "O.D > I.D";
          hasFormErrors = true;      
        }

        //only check validity of linear weight when family is not bit
        if (!this.isValidNumber(comp.linear_weight,0)) {
          error["linear_weight"] = "Invalid value";
          hasFormErrors = true;
        }

        if (!error["inner_diameter"] && !error["outer_diameter"] && !error["linear_weight"]) {
          if (!this.isValidLinearWeight(comp.inner_diameter,comp.outer_diameter,comp.linear_weight)) {
            error["linear_weight"] = "Invalid range";
            hasFormErrors = true;
          }
        }
      }

      if (!this.isValueEmpty(min_tj_id) && !this.isValueEmpty(min_tj_od)) {
        if (!this.isValidNumber(comp.inner_diameter_tooljoint,min_tj_id,max_tj_id)) {
          error["inner_diameter_tooljoint"] = `${min_tj_id}~${max_tj_id} (${shortLengthUnitDisplay})`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.inner_diameter_tooljoint,0,comp.inner_diameter)) {
          error["inner_diameter_tooljoint"] = "Tool Joint I.D <= I.D";
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.outer_diameter_tooljoint,min_tj_od,max_tj_od)) {
          error["outer_diameter_tooljoint"] = `${min_tj_od}~${max_tj_od} (${shortLengthUnitDisplay})`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.outer_diameter_tooljoint,comp.outer_diameter,max_tj_od)) {
          error["outer_diameter_tooljoint"] = "Tool Joint O.D >= O.D";
          hasFormErrors = true;
        }
      }

      if (!this.isValueEmpty(min_length) && max_length) {
        if (!this.isValidNumber(comp.length,min_length,max_length)) {
          error["length"] = `${min_length}~${max_length} (${lengthUnitDisplay})`;
          hasFormErrors = true;
        }
      }

      if (!this.isValueEmpty(comp.length_tooljoint) && !this.isValueEmpty(comp.length)) {
        if(comp.length_tooljoint > comp.length) {
          error["length_tooljoint"] = `Tool Joint Length< Component Length`;
          hasFormErrors = true;
        }
      }

      //specificErrors
      if (comp.family === 'bit') {
        if (!this.isValidNumber(comp.tfa, BIT_MIN_TFA, BIT_MAX_TFA)) {
          error["tfa"] = `TFA must be ${BIT_MIN_TFA}~${BIT_MAX_TFA}`;
          hasFormErrors = true;
        }        
      }

      if (comp.family==='pdm') {        
        if (!this.isValidNumber(comp.number_rotor_lobes, PDM_MIN_ROTOR, PDM_MAX_ROTOR)) {
          error["number_rotor_lobes"] = `It must be ${PDM_MIN_ROTOR}~${PDM_MAX_ROTOR}`;
          hasFormErrors = true;      
        }

        if (!this.isValidNumber(comp.number_stator_lobes, PDM_MIN_STATOR, PDM_MAX_STATOR)) {
          error["number_stator_lobes"] = `It must be ${PDM_MIN_STATOR}~${PDM_MAX_STATOR}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.rpg, PDM_MIN_RPG, PDM_MAX_RPG)) {
          error["rpg"] = `It must be ${PDM_MIN_RPG}~${PDM_MAX_RPG}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.max_weight_on_bit, PDM_MIN_WOB, PDM_MAX_WOB)) {
          error["max_weight_on_bit"] = `It must be ${PDM_MIN_WOB}~${PDM_MAX_WOB}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.min_standard_flowrate, PDM_MIN_FLOW_RANGE, PDM_MAX_FLOW_RANGE)) {
          error["min_standard_flowrate"] = `It must be ${PDM_MIN_FLOW_RANGE}~${PDM_MAX_FLOW_RANGE}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.max_standard_flowrate, PDM_MIN_FLOW_RANGE, PDM_MAX_FLOW_RANGE)) {
          error["max_standard_flowrate"] = `It must be ${PDM_MIN_FLOW_RANGE}~${PDM_MAX_FLOW_RANGE}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.max_operating_differential_pressure, PDM_MIN_MODP, PDM_MAX_MODP)) {
          error["max_operating_differential_pressure"] = `It must be ${PDM_MIN_MODP}~${PDM_MAX_MODP}`;
          hasFormErrors = true;
        }

        if (!this.isValidNumber(comp.torque_at_max_operating_differential_pressure, PDM_MIN_TMODP, PDM_MAX_TMODP)) {
          error["torque_at_max_operating_differential_pressure"] = `It must be ${PDM_MIN_TMODP}~${PDM_MAX_TMODP}`;
          hasFormErrors = true;
        }

      }

      errors["components"][comp.id] = error;
    }

    if (bitFamilyCount > 1) {
      errors["bit_count"] = 'There should be only one "BIT" category.';
      hasFormErrors = true;
    }

    if (bitFamilyCount < 1) {
      errors["bit_count"] = 'There should be at least one "BIT" category.';
      hasFormErrors = true;
    }

    if (bitFamilyCount ===1 && components[components.length-1].family !== 'bit') {
      errors["bit_count"] = '"BIT" category should be on the bottom of the list.';
      hasFormErrors = true;
    }

    if (hasFormErrors) {
      return errors;
    }
    return null;
  }  

  convertRecordBackToImperialUnit(record) {
    // should convert back pdm related units
    // pdm has nested format and must loop through those and convert back everything
    // currently almost units required in pdm not supported in conversion.js(gpm,kip, gpm, etc..)
    
    let convert = this.props.convert;
    let {data} = record.toJS();
    data.start_depth = convert.convertValue(data.start_depth, "length", convert.getUnitPreference("length"),"ft");
    data.end_depth = convert.convertValue(data.end_depth, "length", convert.getUnitPreference("length"),"ft");
    data.components.map((component)=>{
      component.inner_diameter = component.inner_diameter && convert.convertValue(component.inner_diameter, "shortLength", convert.getUnitPreference("shortLength"),"in");
      component.outer_diameter = component.outer_diameter && convert.convertValue(component.outer_diameter, "shortLength", convert.getUnitPreference("shortLength"),"in");      
      component.linear_weight = component.linear_weight && convert.convertValue(component.linear_weight, "force", convert.getUnitPreference("force"), "klbf");
      component.weight = component.weight && convert.convertValue(component.weight, "mass", convert.getUnitPreference("mass"),"lb");
      component.length = component.length && convert.convertValue(component.length, "length", convert.getUnitPreference("length"),"ft");
      component.component_length = component.component_length && convert.convertValue(component.component_length, "length", convert.getUnitPreference("length"),"ft");
      component.outer_diameter_tooljoint = component.outer_diameter_tooljoint && convert.convertValue(component.outer_diameter_tooljoint, "shortLength", convert.getUnitPreference("shortLength"),"in");
      component.inner_diameter_tooljoint = component.inner_diameter_tooljoint && convert.convertValue(component.inner_diameter_tooljoint, "shortLength", convert.getUnitPreference("shortLength"),"in");
      component.length_tooljoint = component.length_tooljoint && convert.convertValue(component.length_tooljoint, "shortLength", convert.getUnitPreference("length"),"ft");
      component.gauge_od = component.gauge_od && convert.convertValue(component.gauge_od, "shortLength", convert.getUnitPreference("shortLength"),"in");
      component.gauge_length = component.gauge_length && convert.convertValue(component.gauge_length, "length", convert.getUnitPreference("length"),"ft");
      component.blade_width = component.blade_width && convert.convertValue(component.blade_width, "length", convert.getUnitPreference("length"),"ft");
      return component;
    });

    return record.set("data", fromJS(data));    
  }
}

DrillstringsApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default DrillstringsApp;
