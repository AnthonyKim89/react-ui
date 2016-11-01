import React, { Component } from 'react';
import { Link } from 'react-router';

import './TabBar.css';

class TabBar extends Component {
  render() {
    return (
      <ul className="TabBar">
        <li className="overview">
          <Link to={this.getPath()} activeClassName="active" onlyActiveOnIndex={true}>Overview</Link>
        </li>
        <li className="tandd">
          <Link to={this.getPath('tandd')} activeClassName="active">Torque + Drag</Link>
        </li>
        <li className="stability">
          <Link to={this.getPath('stability')} activeClassName="active">Wellbore Stability</Link>
        </li>
        <li className="hydraulics">
          <Link to={this.getPath('hydraulics')} activeClassName="active">Hydraulics</Link>
        </li>
        <li className="bit">
          <Link to={this.getPath('bit')} activeClassName="active">Vibration</Link>
        </li>
        <li className="motor">
          <Link to={this.getPath('motor')} activeClassName="active">Motor</Link>
        </li>
        <li className="losses">
          <Link to={this.getPath('losses')} activeClassName="active">Gain/Loss</Link>
        </li>
        <li className="raw">
          <Link to={this.getPath('raw')} activeClassName="active">Trace Curves</Link>
        </li>
      </ul>
    );
  }

  getPath(tab = '') {
    return `/${this.props.page}/${tab}`;
  }

}

export default TabBar;