import React, { Component } from 'react';
import TabBar from './TabBar';

import './WellPage.css';

class WellPage extends Component {
  render() {
    return (
      <div className="c-well-page" >
        {this.props.children}
        <TabBar page={this.props.route.path} />
      </div>
    );
  }
}

export default WellPage;
