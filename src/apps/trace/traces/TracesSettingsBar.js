import React, { Component } from 'react';
import { isEqual } from 'lodash';

import './TracesSettingsBar.css';

class TracesSettingsBar extends Component {
  render() {
    return <div className="c-traces__settings-bar">
    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state);
  }
}

TracesSettingsBar.propTypes = {
};

export default TracesSettingsBar;
