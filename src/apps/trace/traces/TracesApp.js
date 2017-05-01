import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Resizable from 'react-resizable-box';
import { fromJS } from 'immutable';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
const [ _, summarySubscription ] = SUBSCRIPTIONS;
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './TracesApp.css';

class TracesApp extends Component {

  constructor(props) {
    super(props);
    this.resized = this.resized.bind(this);
  }

  render() {
    if (!subscriptions.selectors.getSubData(this.props.data, summarySubscription, false)) {
      return <LoadingIndicator/>;
    }

    return <div className="c-traces">
      <div className="c-traces__slider-chart">
        <Chart
          xField="timestamp"
          size="SMALL"
          widthCols={this.props.widthCols}>
            <ChartSeries
              dashStyle='Solid'
              lineWidth={1}
              key={"measured_depth"}
              id={"measured_depth"}
              title={"Depth"}
              data={this.getSeries()}
              yField={"measured_depth"}
              color={"#fff"} />
        </Chart>
      </div>
      <div className="c-traces__slider" ref={c => { this.sliderContainer = c; }}>
        <Resizable
          className="c-traces__top-slider"
          onResizeStop={this.resized}
          ref={c => { this.topSlider = c; }}
          width={200}
          height={100}
          enable={{top: false, right: false, bottom: true, left: false}}>
          <div className="c-traces__top-info">Start</div>
        </Resizable>
        <div className="c-traces__middle-slider"> </div>
        <Resizable
          className="c-traces__bottom-slider"
          onResizeStop={this.resized}
          ref={c => { this.bottomSlider = c; }}
          width={200}
          height={100}
          enable={{top: true, right: false, bottom: false, left: false}}>
          <div className="c-traces__bottom-info">End</div>
        </Resizable>
      </div>
    </div>;
  }

  resized() {
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);

    let totalHeight = this.sliderContainer.clientHeight - 56;
    let start = this.topSlider.resizable.clientHeight - 26;
    let bottomHeight = this.bottomSlider.resizable.clientHeight - 26;
    let end = totalHeight - bottomHeight;

    let startIndex = Math.round((start/totalHeight) * (summaryData.size - 1));
    let endIndex = Math.round((end/totalHeight) * (summaryData.size - 1));

    console.log(startIndex);
    console.log(endIndex);
  }

  getSeries() {
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);
    let data = [];

    summaryData.valueSeq().forEach(value => {
      data.push({
        measured_depth: value.getIn(["data", "hole_depth"]),
        timestamp: value.get("timestamp"),
      });
    });

    return fromJS(data);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    } else {
      return SUPPORTED_CHART_SERIES[field].defaultColor;
    }
  }

}

TracesApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesApp;
