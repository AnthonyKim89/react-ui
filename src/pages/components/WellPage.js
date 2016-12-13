import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

import WellTabBar from './WellTabBar';
import WellTimeline from './WellTimeline';
import AppGrid from '../../apps/components/AppGrid';

import { wellPages, currentWellPage, currentWellTimeline } from '../selectors';
import { moveApp, loadWellTimeline, setDrillTime, toggleDrillScrollBar } from '../actions';

import './WellPage.css';

class WellPage extends Component {

  componentDidMount() {
    const drillTimeParam = this.props.location.query.drillTime;
    this.props.loadWellTimeline(
      parseInt(this.props.params.wellId, 10),
      drillTimeParam ? moment(drillTimeParam) : null
    );
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.location || newProps.location.query.drillTime !== this.props.location.query.drillTime) {
      this.props.setDrillTime(
        parseInt(newProps.params.wellId, 10),
        moment(newProps.location.query.drillTime)
      );
    }
  }

  render() {
    const wellId = parseInt(this.props.params.wellId, 10);
    const drillTime = this.props.currentWellTimeline && this.props.currentWellTimeline.get('currentTime');
    return (
      <div className="c-well-page" >
        {this.props.currentWellPage &&
          <AppGrid apps={this.props.currentWellPage.get('apps').valueSeq()}
                   onAppMove={(...a) => this.onAppMove(...a)}
                    wellId={wellId}
                    wellDrillTime={drillTime}
                    location={this.props.location} />}
        <WellTabBar wellId={wellId}
                    wellPages={this.props.wellPages}
                    currentWellPage={this.props.currentWellPage}
                    wellDrillTime={drillTime} />
        {this.props.currentWellTimeline &&
          <WellTimeline timeline={this.props.currentWellTimeline}
                        onChangeDrillTime={(...args) => this.onSetDrillTime(...args)}
                        onToggleDrillScrollBar={(...args) => this.onToggleDrillScrollBar(...args)} />}
      </div>
    );
  }

  onAppMove(id, newCoordinates) {
    this.props.moveApp(this.props.currentWellPage, id, newCoordinates);
  }

  onSetDrillTime(time) {
    this.props.router.push(`${this.props.location.pathname}?drillTime=${time.toJSON()}`);
  }

  onToggleDrillScrollBar(visible) {
    this.props.toggleDrillScrollBar(parseInt(this.props.params.wellId, 10), visible);
  }

}

export default connect(
  createStructuredSelector({
    wellPages,
    currentWellPage,
    currentWellTimeline
  }),
  {moveApp, loadWellTimeline, setDrillTime, toggleDrillScrollBar}
)(WellPage);
