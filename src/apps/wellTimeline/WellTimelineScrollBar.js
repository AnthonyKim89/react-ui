import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider'
import { padStart } from 'lodash';
import moment from 'moment';

import 'rc-slider/assets/index.css'

import './WellTimelineScrollBar.css'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class WellTimelineScrollBar extends Component {

  constructor(props) {
    super(props);
    this.state = {value: this.findValue()};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.drillTime && !moment(newProps.drillTime).isSame(this.props.drillTime)) {
      this.setState({value: this.findValue(newProps.drillTime)});
    }
  }

  render() {
    return (
      <div className="c-well-timeline-scroll-bar">
        <button className="c-well-timeline-scroll-bar__arrow"
                disabled={!this.isPossibleToJumpToPrevious()}
                onClick={() => this.jumpToPrevious()}>
          <span className="c-well-timeline-scroll-bar__arrow-left"></span>
        </button>
        <div className="c-well-timeline-scroll-bar__bar">
          {this.props.activity.map((item, index) =>
            this.renderActivityItem(item, index))}
          <div className="c-well-timeline-scroll-bar__slider">
            <Slider 
              min={0} 
              max={this.props.tooltipDepthData.size - 1}
              value={this.state.value}
              onChange={i => this.setState({value: i})}
              onAfterChange={i => this.changeDrillTime()}
              tipFormatter={i => this.formatItem(i)}
              tipTransitionName="rc-slider-tooltip-zoom-down"
            />
          </div>
        </div>
        <button className="c-well-timeline-scroll-bar__arrow"
                disabled={!this.isPossibleToJumpToNext()}
                onClick={() => this.jumpToNext()}>
          <span className="c-well-timeline-scroll-bar__arrow-right"></span>
        </button>
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

  findValue(drillTime = this.props.drillTime) {
    const momentToFind = drillTime && moment(drillTime);
    const entry = this.props.tooltipDepthData
      .findEntry(e => momentToFind && momentToFind.isSame(moment(e.get("entry_at"))));
    if (entry) {
      return entry[0];
    } else {
      return this.props.tooltipDepthData.size - 1;
    }
  }

  changeDrillTime(idx = this.state.value) {
    const item = this.props.tooltipDepthData.get(idx)
    if (item) {
      this.props.onChangeDrillTime(moment(item.get("entry_at")));
    }
  }

  isPossibleToJumpToPrevious() {
    const current = this.findValue();
    return current > 0;
  }

  isPossibleToJumpToNext() {
    const current = this.findValue();
    return current < this.props.tooltipDepthData.size - 1;
  }
  
  jumpToPrevious() {
    this.changeDrillTime(this.findValue() - 1);
  }

  jumpToNext() {
    this.changeDrillTime(this.findValue() + 1);
  }


}

WellTimelineScrollBar.propTypes = {
  tooltipDepthData: ImmutablePropTypes.list.isRequired,
  activity: ImmutablePropTypes.list.isRequired,
  onChangeDrillTime: PropTypes.func.isRequired
};

export default WellTimelineScrollBar;