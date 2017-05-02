import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Resizable from 'react-resizable-box';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Icon } from 'react-materialize';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './TracesSlider.css';

class TracesSlider extends Component {

  constructor(props) {
    super(props);
    this.getRangeHeight = this.getRangeHeight.bind(this);
    this.updateSelectedRange = this.updateSelectedRange.bind(this);
  }

  render() {
    return <div className="c-traces__slider">
      <div className="c-traces__slider-chart">
        <Chart
          xField="timestamp"
          size="SMALL"
          plotBackgroundColor="rgb(32, 31, 31)"
          marginLeft={0}
          marginRight={0}
          marginTop={24}
          marginBottom={24}
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
      <div className="c-traces__slider-interaction" ref={c => { this.sliderContainer = c; }}>
        <Resizable
          className="c-traces__slider-interaction__top-slider"
          onResizeStop={this.updateSelectedRange}
          onResize={this.updateSelectedRange}
          ref={c => { this.topSlider = c; }}
          width={200}
          height={28}
          enable={{top: false, right: false, bottom: true, left: false}}>
          <div className="c-traces__slider-interaction__top-info c-traces__slider-interaction__info"><Icon>menu</Icon><span>{this.getStartLabel()}</span></div>
        </Resizable>
        <div className="c-traces__slider-interaction__middle-slider"> </div>
        <Resizable
          className="c-traces__slider-interaction__bottom-slider"
          onResizeStop={this.updateSelectedRange}
          onResize={this.updateSelectedRange}
          ref={c => { this.bottomSlider = c; }}
          width={200}
          height={28}
          enable={{top: true, right: false, bottom: false, left: false}}>
          <div className="c-traces__slider-interaction__bottom-info c-traces__slider-interaction__info"><Icon>menu</Icon><span>{this.getEndLabel()}</span></div>
        </Resizable>
      </div>
    </div>;
  }

  getRangeHeight() {
    return this.sliderContainer.clientHeight - 66;
  }

  componentDidMount() {
    this.topSlider.setState({
      height: Math.floor(this.getRangeHeight() * 0.9),
    },
    this.updateSelectedRange);
  }

  updateSelectedRange() {
    let totalHeight = this.getRangeHeight();
    let start = (this.topSlider.resizable.clientHeight - 26)/totalHeight;
    let bottomHeight = this.bottomSlider.resizable.clientHeight - 26;
    let end = (totalHeight - bottomHeight)/totalHeight;

    this.props.onRangeChanged(start, end);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.summaryData && !this.props.summaryData.equals(nextProps.summaryData)) {
      this.updateSelectedRange();
    }
  }

  getStartLabel() {
    if (this.props.filteredData.size > 0) {
      let ts = this.props.filteredData.first().get("timestamp");
      return moment.unix(ts).format('MMMD HH:mm');
    }
  }

  getEndLabel() {
    if (this.props.filteredData.size > 0) {
      let ts = this.props.filteredData.last().get("timestamp");
      return moment.unix(ts).format('MMMD HH:mm');
    }
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
  filteredData: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
  onRangeChanged: PropTypes.func.isRequired,
};

export default TracesSlider;
