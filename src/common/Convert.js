import login from '../login';
import { store } from '../store';
import convert from 'convert-units';
import { fromJS } from 'immutable';

/*
  This should be instantiated within a react component and used there.
 */

class Convert {

  constructor() {
    this.user = login.selectors.currentUser(store.getState());
    // TODO: Cache the user's unit type preferences in an object for easy lookup.
  }

  getUser() {
    return this.user;
  }

  GetUserUnitPreference(unitType) {
    // TODO: Implement looking up the user's preference for a given unit type.
    return "m";
  }

  /**
   * Converts a single value from
   * @param value The value we want converted.
   * @param unitType The class of unit such as volume, length, weight, etc.
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
   * Converts a single key/value in a list of immutable maps to
   * @param list The list of maps containing values that we want to convert
   * @param key The key in each map that we want to convert
   * @param unitType The class of unit such as volume, length, weight, etc.
   * @param from The specific unit such as m, gal, lb, etc.
   * @param to (optional) the unit that we want to convert the value to.
   */
  ConvertList(list, key, unitType, from, to=null) {
    if (to === null) {
      to = this.GetUserUnitPreference(unitType);
      if (from === to) {
        return list;
      }
    }
    list = list.toArray();

    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].set(key, this.ConvertValue(list[i].get(key), unitType, from, to));
    }

    return fromJS(list);
  }
}

export default Convert;