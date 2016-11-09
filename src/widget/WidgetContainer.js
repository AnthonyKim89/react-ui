import React, { Component } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';

import './WidgetContainer.css';

class WidgetContainer extends Component {

  render() {
    const classes = {
      'c-widget-container': true,
      'c-widget-container--maximized': this.props.maximized
    };
    return (
      <div className={classSet(classes)}>
        {this.props.maximized ?
          <Link className="c-widget-container__size-link"
                to={{query: {maximize: undefined}}}>
            Restore
          </Link> :
          <Link className="c-widget-container__size-link"
                to={{query: {maximize: this.props.id}}}>
            Full screen
          </Link>}
        <h3 className="c-widget-container__title">{this.props.title}</h3>
        <div className="c-widget-container__content">
          {this.props.children}
        </div>
      </div>
    );
  }
  
}

export default WidgetContainer;
