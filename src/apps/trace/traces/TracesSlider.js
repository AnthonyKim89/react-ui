import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Resizable from 'react-resizable-box';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Icon } from 'react-materialize';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './TracesSlider.css';

const handleHeight = 28;
const handleBorderWidth = 2;
const paddingHeight = 10;

class TracesSlider extends Component {

  constructor(props) {
    super(props);
    this.getRangeHeight = this.getRangeHeight.bind(this);
    this.updateSelectedRange = this.updateSelectedRange.bind(this);
  }

  render() {
    let series = this.getSeries();
    let minValue = series && series.count > 0 ? Math.min(...[series.minBy(x => x.get('hole_depth')).get('hole_depth'), series.minBy(x => x.get('bit_depth')).get('bit_depth')]) || 0 : 0;
    return <div className="c-traces__slider">
      <div className="c-traces__slider-chart">
        <Chart
          chartType="area"
          xField="timestamp"
          size="MEDIUM"
          plotBackgroundColor="#000"
          marginLeft={0}
          marginRight={0}
          marginTop={0}
          marginBottom={0}
          xAxisGridLineDashStyle="longdash"
          yAxisGridLineDashStyle="longdash"
          xAxisGridLineColor="rgb(40, 40, 40)"
          yAxisGridLineColor="rgb(40, 40, 40)"
          xAxisTickInterval={100000}
          yAxisTickInterval={2000}
          widthCols={this.props.widthCols} >
          <ChartSeries
            type="area"
            minValue={minValue}
            fillOpacity={0.5}
            dashStyle='Solid'
            lineWidth={2}
            key={"hole_depth"}
            id={"hole_depth"}
            title={"Depth"}
            data={series}
            yField={"hole_depth"}
            color={"#fff"} />
          <ChartSeries
            type="area"
            minValue={minValue}
            fillOpacity={0.2}
            dashStyle='Solid'
            lineWidth={2}
            key={"bit_depth"}
            id={"bit_depth"}
            title={"Depth"}
            data={series}
            yField={"bit_depth"}
            color={"#333"} />
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
        <div className="c-traces__slider-interaction__middle-slider" ref={c => { this.middleSlider = c; }}>
          <div className="c-traces__slider-interaction__middle-slider__resizer" onMouseDown={e => this.middleScroll(e)}>
            <Icon>format_line_spacing</Icon>
          </div>
        </div>
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

  // Handles clicking/dragging on the center drag handle
  middleScroll(e) {
    // TODO: Make sure this doesn't fire off two updates for every resize event.
    this.topSlider.onResizeStart(e, "bottom");
    this.bottomSlider.onResizeStart(e, "top");
  }

  // Handles Mouse wheel scrolling.
  scrollRange(event) {
    // Change the scroll divisor to change the mouse scroll speed. Higher = slower.
    let scrollDivisor = 10;
    let scrollAmount = (event.deltaY / scrollDivisor) / 1.5;
    scrollAmount = scrollAmount > 0 ? Math.ceil(scrollAmount) : Math.floor(scrollAmount);
    let topHeight = (this.topSlider.resizable.clientHeight + handleBorderWidth) - handleHeight;
    let bottomHeight = (this.bottomSlider.resizable.clientHeight + handleBorderWidth) - handleHeight;

    if (scrollAmount > 0) {
      scrollAmount = bottomHeight < scrollAmount ? bottomHeight : scrollAmount;
    } else if (scrollAmount < 0) {
      scrollAmount = topHeight < Math.abs(scrollAmount) ? -topHeight : scrollAmount;
    }

    if (scrollAmount === 0) return;

    /*
      We have to add the handle border to these measurements because the Resizable component gets confused
      about the 2px border. It sets it to the height we specify and then subtracts the size of the border.
     */
    let newTopHeight = this.topSlider.resizable.clientHeight + scrollAmount + handleBorderWidth;
    let newBottomHeight = this.bottomSlider.resizable.clientHeight - scrollAmount + handleBorderWidth;

    this.topSlider.setState({
      height: newTopHeight,
    }, () => this.bottomSlider.setState({
        height: newBottomHeight,
      },
      this.updateSelectedRange));
  }

  zoomIn() {
    // Minimum zoom.
    if (this.middleSlider.clientHeight < 26) {
      return;
    }

    let topHeight = this.topSlider.resizable.clientHeight + 10;
    let bottomHeight = this.bottomSlider.resizable.clientHeight + 10;

    this.topSlider.setState({
      height: topHeight,
    }, () => this.bottomSlider.setState({
        height: bottomHeight,
      },
      this.updateSelectedRange));
  }

  zoomOut() {
    let topHeight = (this.topSlider.resizable.clientHeight + handleBorderWidth) - handleHeight;
    let bottomHeight = (this.bottomSlider.resizable.clientHeight + handleBorderWidth) - handleHeight;

    let topScroll = -10;
    let bottomScroll = 10;

    topScroll = topHeight < Math.abs(topScroll) ? -topHeight : topScroll;
    bottomScroll = bottomHeight < bottomScroll ? bottomHeight : bottomScroll;

    if (topScroll === 0 && bottomScroll === 0) return;

    /*
     We have to add the handle border to these measurements because the Resizable component gets confused
     about the 2px border. It sets it to the height we specify and then subtracts the size of the border.
     */
    let newTopHeight = this.topSlider.resizable.clientHeight + topScroll + handleBorderWidth;
    let newBottomHeight = this.bottomSlider.resizable.clientHeight - bottomScroll + handleBorderWidth;

    this.topSlider.setState({
      height: newTopHeight,
    }, () => this.bottomSlider.setState({
        height: newBottomHeight,
      },
      this.updateSelectedRange));
  }

  getRangeHeight() {
    return this.sliderContainer.clientHeight - paddingHeight - (2 * handleHeight);
  }

  componentDidMount() {
    this.topSlider.setState({
      height: Math.floor(this.getRangeHeight() * 0.8),
    },
    this.updateSelectedRange);
  }

  updateSelectedRange(triggeredByUser=true) {
    let totalHeight = this.getRangeHeight();
    let tweak = 3;
    let start = (this.topSlider.resizable.clientHeight - handleHeight - tweak)/totalHeight;
    let end = (totalHeight - (this.bottomSlider.resizable.clientHeight - handleHeight - tweak))/totalHeight;

    this.props.onRangeChanged(Math.max(start, 0), Math.min(end, 1), triggeredByUser);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.summaryData && !this.props.summaryData.equals(nextProps.summaryData)) {
      this.updateSelectedRange(false);
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
        hole_depth: value.getIn(["data", "hole_depth"]),
        bit_depth: value.getIn(["data", "bit_depth"]),
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
