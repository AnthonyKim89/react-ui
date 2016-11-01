import React, { Component } from 'react';
import Widget from './Widget';

class WidgetContainer extends Component {
  render() {
    return (
      <div>
        <Widget />
        <Widget />
        <Widget />
      </div>
    );
  }
}

export default WidgetContainer;
