import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import assets from '../../assets';

import './WellTimelineStatusBar.css';

class WellTimelineStatusBar extends Component {
  render() {
    return (
      <div>
        <div className="c-well-timeline-status-bar" onClick={() => this.props.onToggleDrillScrollBar(!this.props.scrollBarVisible)}>
          {this.renderSpace('md')}
          {this.renderMode()}
          {this.renderSpace('md')}
          {this.renderBitDepth()}
          {this.renderSpace('sm')}
          {this.renderHoleDepth()}
          {this.renderSpace('md')}
          {this.renderStatus()}
          {this.renderTimelineToggle()}
          {this.renderSpace('md', 'u-pull-right')}
          {this.renderWellName()}
        </div>
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
      <div className="u-inline-block c-well-timeline-status-bar__stats-box c-well-timeline-status-bar__stats-bit">
        <span className="c-well-timeline-status-bar__title">
          Bit:
        </span>
        <span className="c-well-timeline-status-bar__value">
          {this.props.convert.convertValue(this.props.lastWitsRecord.get('data').get('bit_depth'), 'length', 'ft').fixFloat(2)}
          <span className="u-half-opacity"> {this.props.convert.getUnitDisplay('length')}</span>
        </span>
      </div>
    );
  }

  renderHoleDepth() {
    if (!this.props.lastWitsRecord) {
      return null;
    }
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box c-well-timeline-status-bar__stats-hole">
        <span className="c-well-timeline-status-bar__title">
          Hole:
        </span>
        <span className="c-well-timeline-status-bar__value">
          {this.props.convert.convertValue(this.props.lastWitsRecord.get('data').get('hole_depth'), 'length', 'ft').fixFloat(2)}
          <span className="u-half-opacity"> {this.props.convert.getUnitDisplay('length')}</span>
        </span>
      </div>
    );
  }

  renderTimelineToggle() {
    return (
      <div className="u-inline-block c-well-timeline-status-bar__timeline-toggle">
        <span className="c-well-timeline-status-bar__title">
          Drilling Timeline
        </span>
        {this.renderSpace('sm')}
        {this.props.scrollBarVisible ?
          <i className="fa fa-chevron-down"></i> :
          <i className="fa fa-chevron-up"></i>}
      </div>
    );
  }

  renderWellName() {
    return (
      <div className="u-inline-block c-well-timeline-status-bar__stats-box u-pull-right">
        {this.props.asset.get('parent') &&
        <span className="c-well-timeline-status-bar__parent-title">
          {this.props.isLive ?
            <span className="c-well-timeline-status-bar__status_mark c-well-timeline-status-bar__status_mark--live">&bull;</span> :
            <span className="c-well-timeline-status-bar__status_mark c-well-timeline-status-bar__status_mark--rewind">&bull;</span>}
          {this.props.asset.getIn(['parent', 'name'])}
        </span>}
        <span className="c-well-timeline-status-bar__title">{this.props.asset.get('name')}</span>
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
  data: ImmutablePropTypes.list.isRequired,
  asset: ImmutablePropTypes.map.isRequired,
  lastWitsRecord: ImmutablePropTypes.map,
  scrollBarVisible: React.PropTypes.bool,
  onToggleDrillScrollBar: React.PropTypes.func.isRequired
};

export default WellTimelineStatusBar;
