import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider';
import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';
import parse from 'date-fns/parse';

import 'rc-slider/assets/index.css';

import './WellTimelineScrollBar.css';

const TooltipSlider = Slider.createSliderWithTooltip(Slider);

class WellTimelineScrollBar extends Component {

  constructor(props) {
    super(props);
    this.state = {value: this.findValue()};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.value !== this.state.value || nextProps.data !== this.props.data);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.time) {
      if (this.state.value !== newProps.data.size) {
        this.setState({value: newProps.data.size});
      }
    }  else if (!isEqual(parse(newProps.time), parse(this.props.time))) {
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
          <div className="c-well-timeline-scroll-bar__legend">foofoofoo</div>
          <div className="c-well-timeline-scroll-bar__slider">
            <TooltipSlider
              min={0}
              max={this.props.data.size}
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

  formatItem(idx) {
    const item = this.props.data.get(idx);
    if (!item) {
      return `Live Data`;
    }
    return `${this.formatDate(item.get('timestamp')*1000)} \n ${item.get("data").get('bit_depth')} ft`;
  }

  formatDate(time) {
    const date = parse(time);
    return format(date, 'MMM DD HH:mm:ss');
  }

  findValue(time = this.props.time) {
    const dateToFind = time && parse(time);
    const entry = this.props.data.findEntry(e => dateToFind && isEqual(dateToFind, parse(e.get("timestamp")*1000)));

    if (entry) {
      return entry[0];
    } else {
      return this.props.data.size;
    }
  }

  changeTime(idx = this.state.value) {
    if (idx === this.props.data.size ) {
      this.props.onChangeTime(null);
    } else {
      const item = this.props.data.get(idx);
      if (item) {
        this.props.onChangeTime(parse(item.get("timestamp")*1000));
      }
    }
  }

  isPossibleToJumpToPrevious() {
    const current = this.findValue();
    return current > 0;
  }

  isPossibleToJumpToNext() {
    const current = this.findValue();
    return current < this.props.data.size - 1;
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
  data: ImmutablePropTypes.list.isRequired,
  onChangeTime: PropTypes.func.isRequired
};

export default WellTimelineScrollBar;