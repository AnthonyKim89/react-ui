import React, { Component } from 'react';
import { Link } from 'react-router';

import './TabBar.css';

class TabBar extends Component {
  render() {
    return (
      <ul className="c-tab-bar">
        <li className="c-tab-bar__overview-tab">
          <Link to={this.getPath()} activeClassName="is-active" onlyActiveOnIndex={true}>Overview</Link>
        </li>
        <li className="c-tab-bar__tandd-tab">
          <Link to={this.getPath('tandd')} activeClassName="is-active">Torque + Drag</Link>
        </li>
        <li className="c-tab-bar__stability-tab">
          <Link to={this.getPath('stability')} activeClassName="is-active">Wellbore Stability</Link>
        </li>
        <li className="c-tab-bar__hydraulics-tab">
          <Link to={this.getPath('hydraulics')} activeClassName="is-active">Hydraulics</Link>
        </li>
        <li className="c-tab-bar__bit-tab">
          <Link to={this.getPath('bit')} activeClassName="is-active">Vibration</Link>
        </li>
        <li className="c-tab-bar__motor-tab">
          <Link to={this.getPath('motor')} activeClassName="is-active">Motor</Link>
        </li>
        <li className="c-tab-bar__losses-tab">
          <Link to={this.getPath('losses')} activeClassName="is-active">Gain/Loss</Link>
        </li>
        <li className="c-tab-bar__raw-tab">
          <Link to={this.getPath('raw')} activeClassName="is-active">Trace Curves</Link>
        </li>
      </ul>
    );
  }

  getPath(tab = '') {
    return `/${this.props.page}/${tab}`;
  }

}

export default TabBar;