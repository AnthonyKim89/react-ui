import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WellTabBar from './WellTabBar';
import WidgetGrid from '../widgets/WidgetGrid';

import { wellPages, currentWellPage } from './selectors';
import { moveWidget } from './actions';

import './WellPage.css';

class WellPage extends Component {
  render() {
    const wellId = parseInt(this.props.params.wellId, 10);
    return (
      <div className="c-well-page" >
        {this.props.currentWellPage &&
          <WidgetGrid widgets={this.props.currentWellPage.get('widgets').valueSeq()}
                      onWidgetMove={(...a) => this.onWidgetMove(...a)}
                      wellId={wellId}
                      location={this.props.location} />}
        <WellTabBar wellId={wellId}
                    wellPages={this.props.wellPages}
                    currentWellPage={this.props.currentWellPage} />
      </div>
    );
  }

  onWidgetMove(id, newCoordinates) {
    this.props.moveWidget(this.props.currentWellPage, id, newCoordinates);
  }

}

export default connect(
  createStructuredSelector({
    wellPages,
    currentWellPage
  }),
  {moveWidget}
)(WellPage);
