import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { Icon, Col } from 'react-materialize';
import moment from 'moment';
import { fromJS } from 'immutable';

import Convert from '../../../common/Convert';
import ReactEcharts from './echarts';
import * as api from '../../../api';
import { PREDICTED_TRACES } from '../constants';

import './TracesChartColumn.css';

class TracesChartColumn extends Component {

  constructor(props) {
    super(props);
    this.timerID = null;
    this.predictedDataLoading = false;

    let data = this.getSeries(props);

    this.state = {
      predictedData: {},
      predictedStart: null,
      predictedEnd: null,
      traces: this.getTraces(props),
      options: {
        animation: false,
        toolbox: {
          show : false,
        },
        calculable : true,
        tooltip : {
          trigger: 'axis',
        },
        xAxis : data.xAxis,
        yAxis : [
          {
            type : 'category',
            show: false,
            axisLine : {onZero: false},
            axisLabel : {
              formatter: '{value} km'
            },
            splitLine: {
              show: true,
              onGap: true,
              lineStyle: {
                color: '#666666',
                type: 'dotted',
                width: 2,
              }
            },
            boundaryGap : false,
            data : props.data.reduce((result, point) => {
              result.unshift(moment.unix(point.get("timestamp")).format('MMMD HH:mm'));
              return result;
            }, [])
          }
        ],
        series : data.series,
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0,
        }
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    let opt = this.state.options;

    opt = Object.assign(opt, this.getSeries(nextProps));

    opt.yAxis.data = nextProps.data.reduce((result, point) => {
      result.unshift(moment.unix(point.get("timestamp")).format('MMMD HH:mm'));
      return result;
    }, []);

    this.setState({
      traces: this.getTraces(nextProps),
      options: opt,
    });
  }

  componentDidUpdate() {
    clearInterval(this.timerID);

    // We don't want to spam the API, so if all updates are paused for at least a half a second, we will check if we need new data and go get it.
    this.timerID = setInterval(() => {

      console.log("1");
      if (this.predictedDataLoading) {
        return;
      }
      console.log("2");
      this.predictedDataLoading = true;
      let newPredictedData = {};

      this.props.traceGraphs.valueSeq().forEach((traceGraph, idx) => {

        if (traceGraph.get('source') === 'predicted') {
          //newPredictedData[traceGraph.get('trace')] = this.loadPredictedData(traceGraph);
        }

      });

      this.setState({
        predictedData: Object.assign(this.state.predictedData, newPredictedData),
      });

      this.predictedDataLoading = false;
    }, (this.props.includeDetailedData ? 500 : 60000));
  }

  async loadPredictedData(traceGraph) {
    let trace = find(PREDICTED_TRACES, {trace: traceGraph.get('trace')}) || null;
    if (!trace || this.props.data.size === 0) {
      return;
    }

    let params = fromJS({
      asset_id: this.props.asset.get('id'),
      sort: '{timestamp:1}',
      fields: 'timestamp,'+trace.path.join('.'),
      limit: (this.props.data.last().get('timestamp') - this.props.data.first().get('timestamp')) / 1800,
      where: `{(this.timestamp - (this.timestamp % 60)) == (this.timestamp - (this.timestamp % 1800))}`
    });

    return await api.getAppStorage('corva', trace.collection, this.props.asset.get('id'), params);
  }

  render() {
    let traceRowCount = this.props.traceRowCount !== undefined ? this.props.traceRowCount : 3;    
    return <Col className={"c-traces__chart-column c-traces__chart-column__"+this.props.totalColumns}>
      <div className={"c-traces__chart-column__chart c-traces__chart-column__chart-" + traceRowCount}>
        <ReactEcharts
          lazyUpdate={true}
          style={{height: '100%', width: '100%'}}
          option={this.state.options} />
      </div>
      <div className={"c-traces__chart-column__values c-traces__chart-column__values-" + traceRowCount}>
        {this.state.traces.slice(0, traceRowCount).map(({valid, field, title, color, unit, latestValue, minValue, maxValue}, idx) => (
          <div className="c-traces__chart-column__values__item" key={idx} onClick={() => this.props.editTraceGraph(idx + (4 * this.props.columnNumber))}>
            {valid ? <div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-title c-traces__center"><span>{title}</span></div>
                <div className="c-traces__right" style={{color}}><Icon>network_cell</Icon></div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-value c-traces__center">{latestValue}</div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-unit c-traces__center">{unit}</div>
                <div className="c-traces__chart-column__values__item__meta-row-scale c-traces__left">{minValue && minValue.formatNumeral("0,0.00")}</div>
                <div className="c-traces__chart-column__values__item__meta-row-scale c-traces__right">{maxValue && maxValue.formatNumeral("0,0.00")}</div>
              </div>
            </div> : <div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__center"><Icon>add_circle_outline</Icon></div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
            </div>}
          </div>
        ))}
      </div>
    </Col>;
  }

  getSeries(props) {
    let series = [];

    props.traceGraphs.valueSeq().forEach((traceGraph, idx) => {
      let trace = find(props.supportedTraces, {trace: traceGraph.get('trace')}) || null;

      if (!trace || traceGraph.get('source') === 'predicted') {
        series.push({
          name: '',
          type: 'line',
          symbolSize : '0',
          smooth: false,
          xAxisIndex: idx,
          data: [],
        });
        return;
      }

      series.push({
        name: trace.label,
        type: 'line',
        symbolSize : '0',
        smooth: false,
        xAxisIndex: idx,
        min: traceGraph.get('minValue'),
        max: traceGraph.get('maxValue'),
        scale: traceGraph.get('autoscale'),
        itemStyle: {
          normal: {
            color: traceGraph.get('color'),
            lineStyle: { 
              width: traceGraph.get('lineWidth'),
              type: traceGraph.get('dashStyle')
            },
            areaStyle: {
                color : (function (){
                      if(traceGraph.get('type') === 'area') {
                          let bigint = parseInt(traceGraph.get('color').replace('#', ''), 16);
                          let r = (bigint >> 16) & 255;
                          let g = (bigint >> 8) & 255;
                          let b = bigint & 255;
                          return `rgba(${r},${g},${b},0.5)`;
                      }
                      else {
                        return 'transparent';
                      }
                  })()
            }
          },
        },
        data: props.data.reduce((result, point) => {
          result.unshift(point.get(trace.trace));
          return result;
        }, []),
      });
    });

    return {
      series,
      xAxis: series.map(({min, max, scale}, idx) => (
        {
          type : 'value',
          show: false,
          min: min,
          max: max,
          scale: scale,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#666666',
              type: 'dotted',
              width: 1,
            }
          }
        }))
    };
  }

  getTraces(props) {
    let series = [];

    props.traceGraphs.valueSeq().forEach(traceGraph => {
      let trace = find(props.supportedTraces, {trace: traceGraph.get('trace')}) || null;

      if (!trace) {
        series.push({
          valid: false,
          field: '',
          title: '',
          color: traceGraph.get('color'),
          unit: '',
          type: 'line',
          dashStyle: 'Solid',
          lineWidth: 2,
          minValue: undefined,
          maxValue: undefined,
          latestValue: '--'
        });
        return;
      }

      // Getting the display unit that will be displayed in the metadata
      let unitType = traceGraph.get('unitType', '');
      let displayUnit;
      if (unitType) {
        displayUnit = props.convert.getUnitDisplay(unitType, traceGraph.get('unitTo', null));
      } else if (trace.hasOwnProperty("unitType")) {
        unitType = trace.unitType;
        displayUnit = props.convert.getUnitDisplay(trace.unitType);
      } else if (trace.hasOwnProperty('unit')) {
        displayUnit = trace.unit;
      }

      // Converting the unit on the metadata display
      let latestValue = props.latestData ? props.latestData.getIn(['data', trace.trace], '') : null;
      if (latestValue && unitType) {
        let unitFrom = traceGraph.get('unitFrom');
        let unitTo = traceGraph.get('unitTo', null);

        if (!unitFrom && trace.hasOwnProperty('cunit')) {
          unitFrom = trace.cunit;
        }

        if (unitFrom) {
          latestValue = props.convert.convertValue(parseFloat(latestValue), unitType, unitFrom, unitTo).formatNumeral("0,0.00");
        }
      }

      // Getting the min/max values for auto/static scaling.
      let minValue, maxValue;
      if (!traceGraph.get('autoScale')) {
        minValue = traceGraph.get('minValue');
        maxValue = traceGraph.get('maxValue');
      } else if (trace.hasOwnProperty('min') && trace.hasOwnProperty('max')) {
        minValue = trace.min;
        maxValue = trace.max;
      } else if (traceGraph.get('type') === 'area') {
        // If the graph type is area, and the user didn't set a min/max, we need to manually set a min here.
        // If we don't, it will automatically set the min value at 0 instead of auto-calculating it.
        minValue = (props.data.minBy(x => x.get(trace.trace)) || new Map()).get(trace.trace, 0);
        minValue -= minValue / 1000;
      }

      latestValue = latestValue || '-';

      series.push({
        valid: true,
        field: trace.trace,
        title: trace.label,
        color: traceGraph.get('color'),
        unit: displayUnit,
        type: traceGraph.get('type', 'line'), // area or line
        dashStyle: traceGraph.get('dashStyle', 'solid'), // http://api.highcharts.com/highcharts/plotOptions.line.dashStyle
        lineWidth: traceGraph.get('lineWidth', 2), // 1, 2, or 3
        minValue,
        maxValue,
        latestValue
      });
    });

    return series;
  }
}

TracesChartColumn.propTypes = {
  asset: ImmutablePropTypes.map,
  traceRowCount: PropTypes.number,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list,
  latestData: ImmutablePropTypes.map,
  columnNumber: PropTypes.number.isRequired,
  totalColumns: PropTypes.number.isRequired,
  editTraceGraph: PropTypes.func.isRequired,
  widthCols: PropTypes.number.isRequired,
  includeDetailedData: PropTypes.bool,
};

export default TracesChartColumn;
