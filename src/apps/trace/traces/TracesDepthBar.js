import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
//import Highcharts from 'highcharts';
import moment from 'moment';
import { STATE_CATEGORY_MAP, ACTIVITY_COLORS } from './constants';

import Convert from '../../../common/Convert';

import './TracesDepthBar.css';

class TracesDepthBar extends Component {

  getTraceColor(state) {
    // The try/catch just returns black if the state is incompatible.
    try {
      if(state) {
        return ACTIVITY_COLORS[STATE_CATEGORY_MAP[state]];
      }
      else {
        return ACTIVITY_COLORS['Other'];
      }
    } catch (e) {
      return ACTIVITY_COLORS['Other'];
    }
  }

  render() {
    let startTime, endTime, duration;
    if (this.props.data.size > 0) {
      let startTimeObj = moment.unix(this.props.data.first().get('timestamp'));
      startTime = startTimeObj.format('MMMM D, YYYY HH:mm') + " -";
      let endTimeObj = moment.unix(this.props.data.last().get('timestamp'));
      endTime = endTimeObj.format('MMMM D, YYYY HH:mm');
      duration = moment.duration(endTimeObj.diff(startTimeObj)).humanize();
    }

    return <div className="c-traces__depth-bar">

      <div className="c-traces__depth-bar__chart">
        <div className="c-traces__depth-bar__chart__numbers">
          {this.getDepthDataPoints().map((point, idx) => {
            return <div key={idx} className="c-traces__depth-bar__chart__numbers__tick">
              <div className="c-traces__depth-bar__chart__numbers__tick__time">{point.time}</div>
              <div className="c-traces__depth-bar__chart__numbers__tick__depth">{point.depth}</div>
            </div>;
          })}
        </div>
        <div className="c-traces__depth-bar__chart__bar">
          {this.getColorDataPoints().map((point, idx) => {
            return <div key={idx} className="c-traces__depth-bar__chart__bar__tick" style={{'backgroundColor': this.getTraceColor(point.get('state'))}}  title={point.get('state') || 'Other'}>
            </div>;
          })}
        </div>
      </div>

      <div className="c-traces__depth-bar__values">
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row-date c-traces__depth-bar__values__item__meta-row">
            {startTime}
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-date c-traces__depth-bar__values__item__meta-row">
            {endTime}
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-unit c-traces__depth-bar__values__item__meta-row">
            {duration}
          </div>
        </div>
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row-title c-traces__depth-bar__values__item__meta-row">
            Hole Depth
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-value c-traces__depth-bar__values__item__meta-row">
            {this.props.convert.convertValue(this.props.latestData.getIn(['data', 'hole_depth'], '--'), 'length', 'ft')}
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-unit c-traces__depth-bar__values__item__meta-row">
            {this.props.convert.getUnitDisplay('length')}
          </div>
        </div>
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row-title c-traces__depth-bar__values__item__meta-row">
            Bit Depth
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-value c-traces__depth-bar__values__item__meta-row">
            {this.props.convert.convertValue(this.props.latestData.getIn(['data', 'bit_depth'], '--'), 'length', 'ft')}
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row-unit c-traces__depth-bar__values__item__meta-row">
            {this.props.convert.getUnitDisplay('length')}
          </div>
        </div>
      </div>

    </div>;
  }

  // We limit the data points to 12. First, last, and 10 in between.
  getDepthDataPoints() {
    if (this.props.data.size === 0) {
      return [];
    }

    let points = [{
      time: moment.unix(this.props.data.first().get("timestamp")).format('H:mm'),
      depth: this.props.data.first().get('hole_depth').formatNumeral("0,0")
    }];

    let pointCount = 10;
    for (let i = 1; i <= pointCount; i++) {
      let pointIndex = Math.floor(this.props.data.size * (i/(pointCount+2)));
      let point = this.props.data.get(pointIndex);

      points.push({
        time: moment.unix(point.get("timestamp")).format('H:mm'),
        depth: point.get('hole_depth').formatNumeral("0,0")
      });
    }

    points.push({
      time: moment.unix(this.props.data.last().get("timestamp")).format('H:mm'),
      depth: this.props.data.last().get('hole_depth').formatNumeral("0,0")
    });

    return points;
  }

  // We limit the color data points to 100.
  getColorDataPoints() {
    if (this.props.data.size === 0) {
      return [];
    }

    // If we have less or equal to the the number of points we want, we just return all the data
    let pointCount = 98; // The number of points we want to find in the middle of the first and last points.
    if (this.props.data.size <= (pointCount+2)) {
      return this.props.data;
    }

    let points = [this.props.data.first()];

    for (let i = 1; i <= pointCount; i++) {
      let pointIndex = Math.floor(this.props.data.size * (i/(pointCount+2)));
      points.push(this.props.data.get(pointIndex));
    }

    points.push(this.props.data.last());

    return points;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.data.equals(this.props.data) || !nextProps.latestData.equals(this.props.latestData);
  }

}

TracesDepthBar.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  latestData: ImmutablePropTypes.map.isRequired,
};

export default TracesDepthBar;
