import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Resizable from 'react-resizable-box';
import { fromJS } from 'immutable';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './TracesSlider.css';

class TracesSlider extends Component {

  constructor(props) {
    super(props);
    this.updateSelectedRange = this.updateSelectedRange.bind(this);
  }

  render() {
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
          className="c-traces__slider__top-slider"
          onResizeStop={this.updateSelectedRange}
          ref={c => { this.topSlider = c; }}
          width={200}
          height={100}
          enable={{top: false, right: false, bottom: true, left: false}}>
          <div className="c-traces__slider__top-info">Start</div>
        </Resizable>
        <div className="c-traces__slider__middle-slider"> </div>
        <Resizable
          className="c-traces__slider__bottom-slider"
          onResizeStop={this.updateSelectedRange}
          ref={c => { this.bottomSlider = c; }}
          width={200}
          height={100}
          enable={{top: true, right: false, bottom: false, left: false}}>
          <div className="c-traces__slider__bottom-info">End</div>
        </Resizable>
      </div>
    </div>;
  }

  updateSelectedRange() {
    let totalHeight = this.sliderContainer.clientHeight - 56;
    let start = (this.topSlider.resizable.clientHeight - 26)/totalHeight;
    let bottomHeight = this.bottomSlider.resizable.clientHeight - 26;
    let end = (totalHeight - bottomHeight)/totalHeight;

    this.props.rangeChanged(start, end);
  }

  getSeries() {
    let data = [];

    this.props.summaryData.valueSeq().forEach(value => {
      data.push({
        measured_depth: value.getIn(["data", "hole_depth"]),
        timestamp: value.get("timestamp"),
      });
    });

    return fromJS(data);
  }

}

TracesSlider.propTypes = {
  summaryData: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
  rangeChanged: PropTypes.func.isRequired,
};

export default TracesSlider;
