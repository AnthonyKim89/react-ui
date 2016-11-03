import React, { Component } from 'react';
import classSet from 'react-classset';

import './WidgetContainer.css';

class WidgetContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {maximized: false};
  }

  render() {
    return (
      <div className={classSet({WidgetContainer: true, maximized: this.state.maximized})}>
        {this.props.children}
        <button onClick={() => this.toggleMaximized()}>Maximize/minimize</button>
      </div>
    );
  }
  
  toggleMaximized() {
    this.setState(({maximized: !this.state.maximized}));
  }

}

export default WidgetContainer;
