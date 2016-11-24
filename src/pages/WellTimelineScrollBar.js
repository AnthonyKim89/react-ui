import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider'
import { padStart } from 'lodash';
import moment from 'moment';

import 'rc-slider/assets/index.css'

import './WellTimelineScrollBar.css'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class WellTimelineScrollBar extends Component {

  render() {
    return (
      <div className="c-well-timeline-scroll-bar">
        <div className="c-well-timeline-scroll-bar__arrow">
          <div className="c-well-timeline-scroll-bar__arrow-left"></div>
        </div>
        <div className="c-well-timeline-scroll-bar__bar">
          {this.props.activity.map((item, index) =>
            this.renderActivityItem(item, index))}
          <div className="c-well-timeline-scroll-bar__slider">
            <Slider 
              min={1} 
              max={this.props.tooltipDepthData.size}
              onAfterChange={i => this.changeDrillTime(i)}
              tipFormatter={i => this.formatItem(i)}
              tipTransitionName="rc-slider-tooltip-zoom-down"
            />
          </div>
        </div>
        <div className="c-well-timeline-scroll-bar__arrow">
          <div className="c-well-timeline-scroll-bar__arrow-right"></div>
        </div>
      </div>
    );
  }

  renderActivityItem(item, index) {
    const activity = item.get('activity');
    const relDuration = item.get('relativeDuration');
    const relStart = item.get('relativeStart');
    return <div
      className={`c-well-timeline-scroll-bar__activity c-well-timeline-scroll-bar__activity--${activity}`}
      style={{width: `${relDuration}%`, left: `${relStart}%`}}
      key={index}>
    </div>;
  }

  formatItem(idx) {
    const item = this.props.tooltipDepthData.get(idx - 1)
    if (item) {
      const entryAt = item.get('entry_at');
      const bitDepth = item.get('bit_depth');
      return `${this.formatDate(entryAt)} \n ${bitDepth} ft`;
    } else {
      return '';
    }
  }

  formatDate(time) {
    const dateObj = new Date(time);
    const month = MONTH_NAMES[dateObj.getMonth()];
    const date = padStart(dateObj.getDate(), 2, '0');
    const hour = padStart(dateObj.getHours(), 2, '0');
    const min = padStart(dateObj.getMinutes(), 2, '0');
    const sec = padStart(dateObj.getSeconds(), 2, '0');
    return `${month} ${date} ${hour}:${min}:${sec}`;
  }

  changeDrillTime(idx) {
    const item = this.props.tooltipDepthData.get(idx - 1)
    if (item) {
      this.props.onChangeDrillTime(moment(item.get("entry_at")));
    }
  }


}

WellTimelineScrollBar.propTypes = {
  tooltipDepthData: ImmutablePropTypes.list.isRequired,
  activity: ImmutablePropTypes.list.isRequired,
  onChangeDrillTime: PropTypes.func.isRequired
};

export default WellTimelineScrollBar;