import login from '../login';
import { store } from '../store';
import convert from 'convert-units';
import { Map, fromJS } from 'immutable';

/*
  This should be instantiated within a react component and used there.
 */

class Convert {

  constructor() {
    this.user = login.selectors.currentUser(store.getState());

    this.userUnits = {
      system: this.lookupUserUnitSystem(),
      imperial: {
        length: 'ft',
        mass: 'lb',
        volume: 'gal',
      },
      metric: {
        length: 'm',
        mass: 'kg',
        volume: 'l',
      },
      custom: {
        length: this.lookupCustomUserUnitPreference('length'),
        mass: this.lookupCustomUserUnitPreference('mass'),
        volume: this.lookupCustomUserUnitPreference('volume'),
      }
    };
  }

  lookupCustomUserUnitPreference(unitType) {
    let m = Map(); // Default map if the key can't be found. This avoids null reference exceptions.
    return this.user.get('unit_system', m).get(unitType) ||
      this.user.get('company', m).get('unit_system').get(unitType);
  }

  lookupUserUnitSystem() {
    let m = Map(); // Default map if the key can't be found. This avoids null reference exceptions.
    return this.user.get('unit_system', m).get('system') ||
      this.user.get('company', m).get('unit_system', m).get('system') ||
      'imperial';
  }

  /**
   * Retrieves a user's prefered unit of a given type
   * @param unitType length, mass, volume
   * @returns string
   */
  GetUserUnitPreference(unitType) {
    return this.userUnits[this.userUnits.system][unitType];
  }

  /**
   * Converts a single value from
   * @param value The value we want converted.
   * @param unitType The class of unit such as volume, length, mass, etc.
   * @param from The specific unit such as m, gal, lb, etc.
   * @param to (optional) the unit that we want to convert the value to. May be passed in my ConvertList
   */
  ConvertValue(value, unitType, from, to=null) {
    if (to === null) {
      to = this.GetUserUnitPreference(unitType);
      if (from === to) {
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
   */
  ConvertImmutables(immt, key, unitType, from, to=null) {
    if (to === null) {
      to = this.GetUserUnitPreference(unitType);
      if (from === to) {
        return immt;
      }
    }
    immt = immt.toArray();

    for (let i = 0; i < immt.length; i++) {
      immt[i] = immt[i].set(key, this.ConvertValue(immt[i].get(key), unitType, from, to));
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
   */
  ConvertIterables(iterable, key, unitType, from, to=null) {
    if (to === null) {
      to = this.GetUserUnitPreference(unitType);
      if (from === to) {
        return iterable;
      }
    }

    for (let i = 0; i < iterable.length; i++) {
      iterable[i][key] = this.ConvertValue(iterable[i][key], unitType, from, to);
    }

    return iterable;
  }
}

export default Convert;
