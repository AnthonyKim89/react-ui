import React, { Component } from 'react';
import { Link } from 'react-router';
import classSet from 'react-classset';

import './WidgetContainer.css';

class WidgetContainer extends Component {

  render() {
    return (
      <div className={classSet({WidgetContainer: true, maximized: this.props.maximized})}>
        {this.props.maximized ?
          <Link className="sizeLink" to={{query: {maximize: undefined}}}>Restore</Link> :
          <Link className="sizeLink" to={{query: {maximize: this.props.id}}}>Full screen</Link>}
        <h3>{this.props.title}</h3>
        <div className="widgetContent">
          {this.props.children}
        </div>
      </div>
    );
  }
  
}

export default WidgetContainer;
