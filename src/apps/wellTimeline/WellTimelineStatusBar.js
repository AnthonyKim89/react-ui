import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import assets from '../../assets';

import './WellTimelineStatusBar.css';

class WellTimelineStatusBar extends Component {
  render() {
    return (
      <div className="c-well-timeline-status-bar">
        {this.renderSpace('md')}
        {this.renderMode()}
        {this.renderSpace('md')}
        {this.renderBitDepth()}
        {this.renderSpace('md')}
        {this.renderHoleDepth()}
        {this.renderSpace('md')}
        {this.renderStatus()}
        {this.renderSpace('lg')}
        {this.renderTimelineToggle()}
        {this.renderSpace('md', 'u-pull-right')}
        {this.renderWellName()}
      </div>
    );
  }

  renderMode() {
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box">
        <span className="c-well-timeline-status-bar__title">
          {this.props.isLive && 'Live Mode'}
        </span>
      </div>
    );
  }

  renderBitDepth() {
    if (!this.props.lastWitsRecord) {
      return null;
    }
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box">
        <span className="c-well-timeline-status-bar__title">
          Bit:
        </span>
        <span className="c-well-timeline-status-bar__value">
          {this.props.lastWitsRecord.get('bit_depth')}
        <span className="u-half-opacity"> ft</span></span>
      </div>
    );
  }

  renderHoleDepth() {
    if (!this.props.lastWitsRecord) {
      return null;
    }
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box">
        <span className="c-well-timeline-status-bar__title">
          Hole:
        </span>
        <span className="c-well-timeline-status-bar__value">
          {this.props.lastWitsRecord.get('hole_depth')}
        <span className="u-half-opacity"> ft</span></span>
      </div>
    );
  }

  renderTimelineToggle() {
    return (
      <button className="u-inline-block c-well-timeline-status-bar__timeline-toggle"
              onClick={() => this.props.onToggleDrillScrollBar(!this.props.scrollBarVisible)}>
        <span className="c-well-timeline-status-bar__title">
          Drilling Timeline
        </span>
        {this.renderSpace('md')}
        {this.props.scrollBarVisible ?
          <i className="fa fa-chevron-down"></i> :
          <i className="fa fa-chevron-up"></i>}
      </button>
    );
  }

  renderWellName() {
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box u-pull-right">
        <span className="c-well-timeline-status-bar__title">
          {this.props.asset.get('name')}
          {this.props.asset.get('parent') &&
            <span> ({this.props.asset.getIn(['parent', 'name'])})</span>}
        </span>
      </div>
    );
  }

  renderStatus() {
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box">
        <assets.components.AssetStatus asset={this.props.asset} />
      </div>
    );
  }

  renderSpace(size, otherClass = '') {
    const classes = `
      c-well-timeline-status-bar__space
      c-well-timeline-status-bar__space--${size}
      ${otherClass}
    `;
    return (
      <div className={classes}>&nbsp;</div>
    );
  }

}

WellTimelineStatusBar.propTypes = {
  isLive: React.PropTypes.bool,
  data: ImmutablePropTypes.map,
  asset: ImmutablePropTypes.map.isRequired,
  lastWitsRecord: ImmutablePropTypes.map,
  isScrollBarVisible: React.PropTypes.bool,
  onToggleDrillScrollBar: React.PropTypes.func.isRequired
};

export default WellTimelineStatusBar;
