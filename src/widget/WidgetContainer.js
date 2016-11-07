import React, { Component } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';

import './WidgetContainer.css';

class WidgetContainer extends Component {

  render() {
    return (
      <div className={classSet({WidgetContainer: true, maximized: this.props.maximized})}>
        {this.props.maximized ?
          <Link to={{query: {maximize: undefined}}}>Restore</Link> :
          <Link to={{query: {maximize: this.props.id}}}>Full screen</Link>}
        {this.props.children}
      </div>
    );
  }
  
}

export default WidgetContainer;
