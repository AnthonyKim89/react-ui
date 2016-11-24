import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import WellTabBar from './WellTabBar';
import WellTimeline from './WellTimeline';
import WidgetGrid from '../widgets/WidgetGrid';

import { wellPages, currentWellPage, currentWellTimeline } from './selectors';
import { moveWidget, loadWellTimeline, setDrillTime } from './actions';

import './WellPage.css';

class WellPage extends Component {

  componentDidMount() {
    this.props.loadWellTimeline(parseInt(this.props.params.wellId, 10));
  }

  render() {
    const wellId = parseInt(this.props.params.wellId, 10);
    return (
      <div className="c-well-page" >
        {this.props.currentWellPage &&
          <WidgetGrid widgets={this.props.currentWellPage.get('widgets').valueSeq()}
                      onWidgetMove={(...a) => this.onWidgetMove(...a)}
                      wellId={wellId}
                      wellDrillTime={this.props.currentWellTimeline && this.props.currentWellTimeline.get('currentTime')}
                      location={this.props.location} />}
        <WellTabBar wellId={wellId}
                    wellPages={this.props.wellPages}
                    currentWellPage={this.props.currentWellPage} />
        {this.props.currentWellTimeline &&
          <WellTimeline timeline={this.props.currentWellTimeline}
                        onChangeDrillTime={t => this.props.setDrillTime(wellId, t)} />}
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
    currentWellPage,
    currentWellTimeline
  }),
  {moveWidget, loadWellTimeline, setDrillTime}
)(WellPage);
