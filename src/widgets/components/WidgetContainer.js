import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';

import './WidgetContainer.css';

class WidgetContainer extends Component {

  render() {
    const classes = {
      'c-widget-container': true,
      'c-widget-container--maximized': this.props.maximized,
      'c-widget-container--with-subtitle': this.props.subtitle
    };
    return (
      <div className={classSet(classes)}>
        {this.props.maximized ?
          <Link className="c-widget-container__size-link"
                to={{pathname: this.props.location.pathname, query: {maximize: undefined}}}
                title="Restore">
          </Link> :
          <Link className="c-widget-container__size-link"
                to={{pathname: this.props.location.pathname, query: {maximize: this.props.id}}}
                title="Full screen">
          </Link>}
        <h4 className="c-widget-container__title">{this.props.title}</h4>
        {this.props.subtitle &&
          <h5 className="c-widget-container__subtitle">{this.props.subtitle}</h5>}
        <div className="c-widget-container__content">
          {this.props.children}
        </div>
      </div>
    );
  }
  
}

WidgetContainer.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  location: PropTypes.object.isRequired,
  maximized: PropTypes.bool
};

export default WidgetContainer;
