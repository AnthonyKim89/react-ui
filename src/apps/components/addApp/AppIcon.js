import React, { Component, PropTypes } from 'react';
import classSet from 'react-classset';
import { noop } from 'lodash';

import './AppIcon.css';

class AppIcon extends Component {

  render() {
    const classes = {'c-app-icon': true, 'c-app-icon--is-clickable': !!this.props.onClick};
    return <svg className={classSet(classes)} viewBox="0 0 100 85" onClick={this.props.onClick || noop}>
      <polygon className="c-app-icon__pentagon"
               points="25,2 75,2 98,41 75,83 25,83 2,41">
      </polygon>
      <circle className="c-app-icon__icon"
        cx="50"
        cy="42.5"
        r="22" />
      <text x="43" y="50" className="c-app-icon__name">
        {this.getTitleAbbreviation()}
      </text>
    </svg>;
  }

  getTitleAbbreviation() {
    var title = this.props.title || this.props.settingsTitle;
    return title ? title.charAt(0).toUpperCase()  : '';
  }

}

AppIcon.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default AppIcon;