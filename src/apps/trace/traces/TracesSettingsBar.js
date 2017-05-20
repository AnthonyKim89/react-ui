import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Icon } from 'react-materialize';

import './TracesSettingsBar.css';

class TracesSettingsBar extends Component {
  render() {
    return <div className="c-traces__settings-bar">
      <div className="c-traces__settings-bar__setting">
        <div className="c-traces__settings-bar__setting__icon"><Icon>video_label</Icon></div>
        <div className="c-traces__settings-bar__setting__label">Display</div>
      </div>
    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state);
  }
}

TracesSettingsBar.propTypes = {
};

export default TracesSettingsBar;
