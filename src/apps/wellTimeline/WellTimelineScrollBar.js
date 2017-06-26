import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider';
import format from 'date-fns/format';
import isEqual from 'date-fns/is_equal';
import parse from 'date-fns/parse';
import { fromJS } from 'immutable';

import { Size } from '../../common/constants';
import Chart from '../../common/Chart';
import ChartSeries from '../../common/ChartSeries';
import { SUPPORTED_CHART_SERIES } from './constants';

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
    let series = this.getSeries();
    return (
      <div className="c-well-timeline-scroll-bar">
        <div className="c-well-timeline-scroll-bar__chart-container">
          <Chart
            xField="timestamp"
            horizontal={true}
            size={Size.MEDIUM}
            widthCols={1}
            plotBackgroundColor="rgb(69, 81, 84)"
            hideXAxis={true}
            showFirstYLabel={false}
            showLastYLabel={false}
            yAxisReversed={true}
            reserveYLabelSpace={false}
            marginBottom={0}
            marginLeft={20}
            marginRight={20}
            marginTop={0}
            xAxisType="datetime"
            tooltipFormatter={function() {
              return `<span style="color:${this.series.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
            }}
            tooltipValueSuffix={" " + this.props.convert.getUnitDisplay("length")}
            yAxisLabelFormatter={this.yAxisLabelFormatter}>
            {Object.keys(SUPPORTED_CHART_SERIES).map(field => (
              <ChartSeries
                key={field}
                id={field}
                yField={field}
                data={series}
                lineWidth={2}
                title={SUPPORTED_CHART_SERIES[field].label}
                color={SUPPORTED_CHART_SERIES[field].color} />
            ))}
          </Chart>
        </div>
        <div className="c-well-timeline-scroll-bar__slider-container">
          <button className="c-well-timeline-scroll-bar__arrow"
                  disabled={!this.isPossibleToJumpToPrevious()}
                  onClick={() => this.jumpToPrevious()}>
            <span className="c-well-timeline-scroll-bar__arrow-left"></span>
          </button>

          <div className="c-well-timeline-scroll-bar__bar">
            {this.renderLegend(series)}
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
      </div>
    );
  }

  yAxisLabelFormatter() {
    return this.value.formatNumeral('0a');
  }

  getSeries() {
    let series = [];
    const data = this.props.data.valueSeq().sortBy(x => x.get('timestamp'));
    data.forEach((value, index) => {
      let point = {
        timestamp: (index * 21600),//value.get('timestamp')*1000,
        actual_timestamp: value.get('timestamp')*1000,
        time: value.get('data').get('time')
      };
      Object.keys(SUPPORTED_CHART_SERIES).map(field => (
        point[field] = this.props.convert.convertValue(value.get('data').get(field), SUPPORTED_CHART_SERIES[field].unitType, SUPPORTED_CHART_SERIES[field].unit)
      ));
      series.push(point);
    });
    return fromJS(series);
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
        this.props.onChangeTime(item.get("timestamp"));
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

  renderLegend(series) {
    let days = this.getLegendDays(series);
    return (
      <div className="c-well-timeline-scroll-bar__legend">
        {days.map(day => (
          <div className="c-well-timeline-scroll-bar__legend__day" style={{width: 100/days.length + '%'}} key={day}>
            {day}
          </div>
        ))}
      </div>
    );
  }

  getLegendDays(series) {
    let days = [];
    series.valueSeq().forEach((value) => {
      let date = new Date(value.get('actual_timestamp'));
      let day = date.getDate();
      if (!days.includes(day)) {
        days.push(day);
      }
    });

    let startMonth = new Date(this.props.data.first().get('timestamp')*1000).toLocaleString("en-us", { month: "short" });
    let endMonth = new Date(this.props.data.last().get('timestamp')*1000).toLocaleString("en-us", { month: "short" });

    days[0] = startMonth + ' ' + days[0];
    days[days.length-1] = endMonth + ' ' + days[days.length-1];

    return days;
  }
}

WellTimelineScrollBar.propTypes = {
  time: PropTypes.string,
  data: ImmutablePropTypes.list.isRequired,
  onChangeTime: PropTypes.func.isRequired
};

export default WellTimelineScrollBar;