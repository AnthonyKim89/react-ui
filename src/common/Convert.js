import convert from 'corva-convert-units';
import { Map, fromJS } from 'immutable';

import login from '../login';
import { store } from '../store';

/*
  This conversion class acts as a smart wrapper for corva-convert-units (a fork of the npm convert-units module.
  It will automatically inject the current user's unit conversion preferences, so apps can easily convert
    units without having to individually look up a user's details.
  This should be instantiated within a react component and used there. It requires a react component context because
    it relies on the react-redux store to get the current state so selectors can use it.
  This will automatically be added to every App when it's instantiated as the `convert` prop.
    this.props.convert.convertValue(...), etc.
 */

class Convert {
  defaultSystem = 'imperial';

  constructor() {
    this.user = login.selectors.currentUser(store.getState());
    this.system = this._lookupUserUnitSystem();

    this.units = {
      imperial: {
        length: 'ft',
        mass: 'lb',
        volume: 'gal',
        pressure: 'psi',
        temperature: 'F',
        speed: 'm/h',
        area: 'ft2',
        force: 'lbf',
        oil: 'bbl',
        yp: 'dsf',
      },
      metric: {
        length: 'm',
        mass: 'kg',
        volume: 'l',
        pressure: 'kPa',
        temperature: 'C',
        speed: 'km/h',
        area: 'm2',
        force: 'nm',
        oil: 'm3',
        yp: 'Pa',
      },
      custom: {},
    };

    this.units.custom = Object.assign(this.units.custom, {
      length: this._lookupCustomUserUnitPreference('length'),
      mass: this._lookupCustomUserUnitPreference('mass'),
      volume: this._lookupCustomUserUnitPreference('volume'),
      pressure: this._lookupCustomUserUnitPreference('pressure'),
      temperature: this._lookupCustomUserUnitPreference('temperature'),
      speed: this._lookupCustomUserUnitPreference('speed'),
      area: this._lookupCustomUserUnitPreference('area'),
      force: this._lookupCustomUserUnitPreference('force'),
      oil: this._lookupCustomUserUnitPreference('oil'),
      yp: this._lookupCustomUserUnitPreference('yp'),
    });
  }

  _lookupCustomUserUnitPreference(unitType) {
    if (this.user === null) {
      return this.units[this.defaultSystem][unitType];
    }

    let m = Map(); // Default map if the key can't be found. This avoids null reference exceptions.
    return this.user.get('unit_system', m).get(unitType) ||
      this.user.get('company', m).get('unit_system').get(unitType) ||
      this.units[this.defaultSystem][unitType];
  }

  _lookupUserUnitSystem() {
    if (this.user === null) {
      return this.defaultSystem;
    }

    let m = Map(); // Default map if the key can't be found. This avoids null reference exceptions.
    return this.user.get('unit_system', m).get('system') ||
      this.user.get('company', m).get('unit_system', m).get('system') ||
      this.defaultSystem;
  }

  /**
   * Retrieves a user's prefered unit of a given type
   * @param unitType length, mass, volume, etc
   * @returns string
   */
  getUnitPreference(unitType) {
    return this.units[this.system][unitType];
  }

  /**
   * Retrieves the unit display name for a given unit type
   * @param unitType length, mass, volume, etc
   * @returns string
   */
  getUnitDisplay(unitType) {
    return convert().describe(this.getUnitPreference(unitType)).display;
  }

  /**
   * Retrieves the full name for a given unit type, singular
   * @param unitType length, mass, volume, etc
   * @returns string
   */
  getUnitSingular(unitType) {
    return convert().describe(this.getUnitPreference(unitType)).singular;
  }

  /**
   * Retrieves the full name for a given unit type, plural
   * @param unitType length, mass, volume, etc
   * @returns string
   */
  getUnitPlural(unitType) {
    return convert().describe(this.getUnitPreference(unitType)).plural;
  }

  /**
   * Converts a single value
   * @param value The value we want converted.
   * @param unitType The class of unit such as volume, length, mass, etc.
   * @param from The specific unit such as m, gal, lb, etc.
   * @param to (optional) the unit that we want to convert the value to. May be passed in my ConvertList
   * @return number
   */
  convertValue(value, unitType, from, to=null) {
    if (to === null) {
      to = this.getUnitPreference(unitType);
      if (typeof to === 'undefined' || to === null || from === to) {
        return value;
      }
    }

    value = convert(value).from(from).to(to);
    return value;
  }

  /**
   * Converts a key in an immutable list of immutables.
   * @param immt The list of maps/lists containing values that we want to convert
   * @param key The key in each sub-iterable that we want to convert
   * @param unitType The class of unit such as volume, length, mass, etc.
   * @param from The specific unit such as m, gal, lb, etc.
   * @param to (optional) the unit that we want to convert the value to.
   * @returns Immutable
   */
  convertImmutables(immt, key, unitType, from, to=null) {
    if (to === null) {
      to = this.getUnitPreference(unitType);
      if (typeof to === 'undefined' || to === null || from === to) {
        return immt;
      }
    }
    immt = immt.toArray();

    for (let i = 0; i < immt.length; i++) {
      immt[i] = immt[i].set(key, this.convertValue(immt[i].get(key), unitType, from, to));
    }

    return fromJS(immt);
  }

  /**
   * Converts a property in a simple array of js objects or arrays.
   * @param iterable The array of iterables containing values that we want to convert
   * @param key The key in each sub-element that we want to convert
   * @param unitType The class of unit such as volume, length, mass, etc.
   * @param from The specific unit such as m, gal, lb, etc.
   * @param to (optional) the unit that we want to convert the value to.
   * @returns Array
   */
  convertArray(iterable, key, unitType, from, to=null) {
    if (to === null) {
      to = this.getUnitPreference(unitType);
      if (typeof to === 'undefined' || to === null || from === to) {
        return iterable;
      }
    }

    for (let i = 0; i < iterable.length; i++) {
      iterable[i][key] = this.convertValue(iterable[i][key], unitType, from, to);
    }

    return iterable;
  }
}

export default Convert;
