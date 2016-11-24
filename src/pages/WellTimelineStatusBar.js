import React, { Component } from 'react'

import './WellTimelineStatusBar.css'

class WellTimelineStatusBar extends Component {
  render() {
    return (
      <div className="c-well-timeline-status-bar">
        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-box">
          <span className="c-well-timeline-status-bar__title">
            Live Mode
          </span>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-box">
          <span className="c-well-timeline-status-bar__title">Bit:</span>
          <span className="c-well-timeline-status-bar__value">18,001<span className="u-half-opacity"> ft</span></span>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-box">
          <span className="c-well-timeline-status-bar__title">Hole:</span>
          <span className="c-well-timeline-status-bar__value">18,001<span className="u-half-opacity"> ft</span></span>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-boxx">
          <div className="c-well-timeline-status-bar__string_mark"></div>
          <span className="c-well-timeline-status-bar__value">Circulating</span>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-lg">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__timeline-toggle">
          <span className="c-well-timeline-status-bar__title">
            Drilling Timeline
          </span>
          <i className="fa fa-chevron-up"></i>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md u-pull-right">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-box u-pull-right">
          <span className="c-well-timeline-status-bar__title">Scharbauer Ranch 3202H</span>
        </div>

        <div className="c-well-timeline-status-bar__space c-well-timeline-status-bar__space-md u-pull-right">&nbsp;</div>

        <div className="u-inline-block c-well-timeline-status-bar__stats-box u-pull-right">
          <div className="c-well-timeline-status-bar__status_mark"></div>
          <span className="c-well-timeline-status-bar__value">H&P 637</span>
        </div>
        
      </div>
    )
  }
}

WellTimelineStatusBar.propTypes = {
  dataLoaded: React.PropTypes.bool,
  onToggleTimelineSlider: React.PropTypes.func
}

export default WellTimelineStatusBar