import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

import WellTabBar from './WellTabBar';
import WellTimeline from './WellTimeline';
import WidgetGrid from '../widgets/WidgetGrid';

import { wellPages, currentWellPage, currentWellTimeline } from './selectors';
import { moveWidget, loadWellTimeline, setDrillTime } from './actions';

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
          <WidgetGrid widgets={this.props.currentWellPage.get('widgets').valueSeq()}
                      onWidgetMove={(...a) => this.onWidgetMove(...a)}
                      wellId={wellId}
                      wellDrillTime={drillTime}
                      location={this.props.location} />}
        <WellTabBar wellId={wellId}
                    wellPages={this.props.wellPages}
                    currentWellPage={this.props.currentWellPage}
                    wellDrillTime={drillTime} />
        {this.props.currentWellTimeline &&
          <WellTimeline timeline={this.props.currentWellTimeline}
                        onChangeDrillTime={t => this.onSetDrillTime(t)} />}
      </div>
    );
  }

  onWidgetMove(id, newCoordinates) {
    this.props.moveWidget(this.props.currentWellPage, id, newCoordinates);
  }

  onSetDrillTime(time) {
    this.props.router.push(`${this.props.location.pathname}?drillTime=${time.toJSON()}`);
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
