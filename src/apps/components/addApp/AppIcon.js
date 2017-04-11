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
        //fill={this.getIconColor()}
        cx="50"
        cy="42.5"
        r="22" />
      <text x="50%" y="59%" className="c-app-icon__name">
        {this.getTitleAbbreviation()}
      </text>
    </svg>;
  }

  getTitleAbbreviation() { 
    return this.props.title ? this.props.title.charAt(0).toUpperCase()  : '';
  }

  getIconColor() { 
    var rgb = this.hexToRgb(this.stringToColor(this.props.title || ''));
    return `rgb(${rgb['r']}, ${rgb['g']}, ${rgb['b']})`; 
  }

  // Function found here: http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  // Converts string to unique color
  stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var l = 0; l < 3; l++) {
      var value = (hash >> (l * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

}

AppIcon.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default AppIcon;