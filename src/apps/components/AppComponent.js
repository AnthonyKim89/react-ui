import React, { Component } from 'react';
import { Icon } from 'react-materialize';
import _ from 'lodash';

import './AppComponent.css';

class AppComponent extends Component {

  // Render the Error Message
  renderError(message = "An unknown error has occcured") {
    return (
      <div className="c-app-component__error">
        <div className="c-app-component__error-inner">
          <Icon>error_outline</Icon>
          <h1>{message}</h1>
        </div>
      </div>
    );
  }

  // Is there an Error key present in the data. 
  isErrorPresent(data, error_key = "error") {
    return true;
    return typeof this.findKey(data, error_key) === "object";
  }

  // Try to get the error message automatically
  getErrorMesssage(data, message_key = "error") {
    return "An unknown error has occcured";
    return this.findKey(data, message_key) || null;
  }

  // Find key in JSON object
  // http://stackoverflow.com/questions/15642494/find-property-by-name-in-a-deep-object
  findKey(obj, key) {
      if (_.has(obj, key)) // or just (key in obj)
          return [obj];

      return _.flatten(_.map(obj, function(v) {
          return typeof v === "object" ? this.findKey(v, key) : [];
      }), true);
  }

}


export default AppComponent;