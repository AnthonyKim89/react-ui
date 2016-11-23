import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WellTabBar from './WellTabBar';
import WidgetGrid from './widgets/WidgetGrid';
import { wellPages, currentWellPage } from './pages/selectors';

import './WellPage.css';

class WellPage extends Component {
  render() {
    const wellId = parseInt(this.props.params.wellId, 10);
    return (
      <div className="c-well-page" >
        {this.props.currentWellPage &&
          <WidgetGrid widgets={this.props.currentWellPage.get('widgets')}
                      wellId={wellId}
                      location={this.props.location} />}
        <WellTabBar wellId={wellId}
                    wellPages={this.props.wellPages}
                    currentWellPage={this.props.currentWellPage} />
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    wellPages,
    currentWellPage
  })
)(WellPage);
