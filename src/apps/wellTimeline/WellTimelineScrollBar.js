import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider';
import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';
import parse from 'date-fns/parse';

import 'rc-slider/assets/index.css';

import './WellTimelineScrollBar.css';

class WellTimelineScrollBar extends Component {

  constructor(props) {
    super(props);
    this.state = {value: this.findValue()};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.time && !isEqual(parse(newProps.time), parse(this.props.time))) {
      this.setState({value: this.findValue(newProps.time)});
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
              onAfterChange={i => this.changeTime()}
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
    const item = this.props.tooltipDepthData.get(idx);
    if (item) {
      const entryAt = item.get('entry_at');
      const bitDepth = item.get('bit_depth');
      return `${this.formatDate(entryAt)} \n ${bitDepth} ft`;
    } else {
      return '';
    }
  }

  formatDate(time) {
    const date = parse(time);
    return format(date, 'MMM DD HH:mm:ss');
  }

  findValue(time = this.props.time) {
    const dateToFind = time && parse(time);
    const entry = this.props.tooltipDepthData
      .findEntry(e => dateToFind && isEqual(dateToFind, parse(e.get("entry_at"))));
    if (entry) {
      return entry[0];
    } else {
      return this.props.tooltipDepthData.size - 1;
    }
  }

  changeTime(idx = this.state.value) {
    if (idx === this.props.tooltipDepthData.size - 1) {
      // Last value means we go live
      this.props.onChangeTime(null);
    } else {
      const item = this.props.tooltipDepthData.get(idx);
      if (item) {
        this.props.onChangeTime(parse(item.get("entry_at")));
      }
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
    this.changeTime(this.findValue() - 1);
  }

  jumpToNext() {
    this.changeTime(this.findValue() + 1);
  }


}

WellTimelineScrollBar.propTypes = {
  time: PropTypes.string,
  data: ImmutablePropTypes.map,
  tooltipDepthData: ImmutablePropTypes.list.isRequired,
  activity: ImmutablePropTypes.list.isRequired,
  onChangeTime: PropTypes.func.isRequired
};

export default WellTimelineScrollBar;