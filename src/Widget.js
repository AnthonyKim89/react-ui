import React, { Component } from 'react';
import classSet from 'react-classset';

import './Widget.css';

class Widget extends Component {

  constructor(props) {
    super(props);
    this.state = {maximized: false};
  }

  render() {
    return (
      <div className={classSet({Widget: true, maximized: this.state.maximized})}>
        <h4>Broomstick</h4>
        <button onClick={() => this.toggleMaximized()}>Maximize/minimize</button>
      </div>
    );
  }
  
  toggleMaximized() {
    this.setState(({maximized: !this.state.maximized}));
  }

}

export default Widget;
