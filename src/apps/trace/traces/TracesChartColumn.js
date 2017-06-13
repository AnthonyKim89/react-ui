import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { Icon, Col } from 'react-materialize';
import moment from 'moment';
import { List, fromJS } from 'immutable';

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
    this.predictedData = {};
    this.predictedDataRange = [null, null];
    this.activeSubscriptions = {};

    this.yAxisData = props.data.reduce((result, point) => {
      result.unshift(moment.unix(point.get("timestamp")).format('MMMD HH:mm'));
      return result;
    }, []);

    let data = this.getSeries(props);

    this.state = {
      traces: this.getTraces(props),
      lastPredictedDataLoad: null,
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
            data : this.yAxisData,
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

    let lastPredictedDataLoad = this.state.lastPredictedDataLoad;
    if (!this.props.traceGraphs.equals(nextProps.traceGraphs)) {
      this.predictedDataRange = [null, null];
      lastPredictedDataLoad = null;
    }

    this.setState({
      traces: this.getTraces(nextProps),
      options: opt,
      lastPredictedDataLoad,
    });
  }

  componentDidUpdate() {
    // We don't reload predicted data if we're already loading it, or if if hasn't been 1/2 second yet.
    if (this.props.data.size === 0 || this.predictedDataLoading || (this.state.lastPredictedDataLoad !== null && this.state.lastPredictedDataLoad > (new Date().getTime() - 500))) {
      return;
    }

    clearTimeout(this.timerID);

    // We don't want to spam the API, so if all updates are paused for at least a half a second, we will check if we need new data and go get it.
    // The state setting at the end of the predicted loading will merge in the new data
    this.timerID = setTimeout(() => this.initPredictedDataLoad(), 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  async initPredictedDataLoad() {
    if (this.props.data.size === 0) {
      return;
    }

    this.predictedDataLoading = true;
    let startTS = this.props.data.first().get('timestamp');
    let endTS = this.props.data.last().get('timestamp');
    let operation = 'replace';

    // Figuring out what kind of partial load, etc, we need to execute here.
    if (this.predictedDataRange[0] !== null && this.predictedDataRange[1] !== null) {
      if (startTS >= this.predictedDataRange[0] && endTS <= this.predictedDataRange[1]) {
        // If the range is the same or smaller than it used to be, we just return. No need to load new data
        this.predictedDataLoading = false;
        return;
      } else if (startTS < this.predictedDataRange[0] && endTS >= this.predictedDataRange[0] && endTS <= this.predictedDataRange[1]) {
        // If the startTS is before the endTS, and the endTS is still inside the range, we prepend data to the list.
        operation = 'prepend';
        endTS = this.predictedDataRange[0];
      } else if (endTS > this.predictedDataRange[1] && startTS <= this.predictedDataRange[1] && startTS >= this.predictedDataRange[0]) {
        // If the endTS is after the startTS and the startTS is still inside the range, we append data to the list.
        operation = 'append';
        startTS = this.predictedDataRange[1];
      }
    }

    let traceGraphs = this.props.traceGraphs.toJS(); // We can't map/forEach this data because we to await async calls inside the loop
    for (let tg = 0; tg < traceGraphs.length; tg++) {
      if (traceGraphs[tg]['source'] === 'predicted' && traceGraphs[tg]['trace']) {
        let result = await this.loadPredictedData(traceGraphs[tg], startTS, endTS);
        result = result.map(value => value.flatten());
        result = this.convertPredictedUnitField(traceGraphs[tg], result);
        
        if (!this.predictedData.hasOwnProperty(traceGraphs[tg]['trace'])) {
          this.predictedData[traceGraphs[tg]['trace']] = new List();
        }

        // Setting our data based on the kind of load operation this is.
        if (operation === 'replace') {
          this.predictedData[traceGraphs[tg]['trace']] = result;
        } else if (operation === 'append') {
          this.predictedData[traceGraphs[tg]['trace']] = this.predictedData[traceGraphs[tg]['trace']].push(...result);
        } else if (operation === 'prepend') {
          this.predictedData[traceGraphs[tg]['trace']] = this.predictedData[traceGraphs[tg]['trace']].unshift(...result);
        }
      }
    }

    // Updating the current range loaded data.
    if (operation === 'replace') {
      this.predictedDataRange = [startTS, endTS];
    } else if (operation === 'append') {
      this.predictedDataRange = [this.predictedDataRange[0], endTS];
    } else if (operation === 'prepend') {
      this.predictedDataRange = [startTS, this.predictedDataRange[1]];
    }

    this.predictedDataLoading = false;

    // This will force a refresh, but lastPredictedDataLoad will also prevent an endless loop of data loading.
    this.setState({
      lastPredictedDataLoad: new Date().getTime(),
    });
  }

  convertPredictedUnitField(traceEntry, filteredData) {
    let trace = find(PREDICTED_TRACES, {trace: traceEntry.trace});
    let traceKey = trace.path;

    let unitType = traceEntry.unitType || null;
    let unitFrom = traceEntry.unitFrom || null;
    let unitTo = traceEntry.unitTo || null;

    // Typically we will fall into this if-statement because common selections won't have a unit type chosen.
    if (!unitType) {
      if (!trace || !trace.hasOwnProperty('unitType') || !trace.hasOwnProperty('cunit')) {
        return filteredData;
      }
      unitType = trace.unitType;
      unitFrom = trace.cunit;
    }

    if (!unitFrom) {
      unitFrom = this.props.convert.getUnitPreference(unitType);
    }

    return this.props.convert.convertImmutables(filteredData, traceKey, unitType, unitFrom, unitTo);
  }

  async loadPredictedData(traceGraph, startTS, endTS) {
    let trace = find(PREDICTED_TRACES, {trace: traceGraph['trace']}) || null;
    if (!trace) {
      return;
    }

    let where;
    if (this.props.includeDetailedData && (endTS - startTS) < 43200) {
      where = `{(this.timestamp - (this.timestamp % 60)) == (this.timestamp - (this.timestamp % 60)) && this.timestamp >= ${startTS} && this.timestamp <= ${endTS}}`;
    } else {
      where = `{(this.timestamp - (this.timestamp % 60)) == (this.timestamp - (this.timestamp % 1800)) && this.timestamp >= ${startTS} && this.timestamp <= ${endTS}}`;
    }

    let params = fromJS({
      asset_id: this.props.asset.get('id'),
      sort: '{timestamp:1}',
      fields: 'timestamp,data.'+trace.path,
      limit: 100000,
      where
    });

    try {
      return await api.getAppStorage('corva', trace.collection, this.props.asset.get('id'), params);
    } catch (e) {
      return new List();
    }
  }

  subscribe(id, traceIndex, provider, collection, fields) {
    let sub = {provider, collection, params: {sort: '{timestamp:1}', fields}};
    let uid = this.props.columnNumber + id + traceIndex;

    this.activeSubscriptions[uid] = sub;

    this.props.onAppSubscribe(
      uid,
      [sub],
      this.props.asset.get('id')
    );
  }

  unsubscribe(id, traceIndex) {
    let uid = this.props.columnNumber + id + traceIndex;

    this.props.onAppUnsubscribe(uid, [this.activeSubscriptions[uid]]);

    delete this.activeSubscriptions[uid];
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
        {this.state.traces.slice(0, traceRowCount).map(({valid, field, title, color, unit, minValue, maxValue, latestValue, source}, idx) => (
          <div className="c-traces__chart-column__values__item" key={idx} onClick={() => this.props.editTraceGraph(idx + (4 * this.props.columnNumber))}>
            {valid ? <div title={source === 'predicted' ? 'Predicted' : ''}>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-title c-traces__center"><span>{title}{source === 'predicted' ? ' (P)' : ''}</span></div>
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
    let series = this.state ? this.state.options.series : [];

    props.traceGraphs.valueSeq().forEach((traceGraph, idx) => {
      let trace;
      if (traceGraph.get('source') === 'predicted') {
        trace = find(PREDICTED_TRACES, {trace: traceGraph.get('trace')}) || null;
      } else {
        trace = find(props.supportedTraces, {trace: traceGraph.get('trace')}) || null;
      }

      if (!trace) {
        series[idx] = {
          name: '',
          type: 'line',
          symbolSize : '0',
          smooth: false,
          xAxisIndex: idx,
          data: [],
        };
        return;
      }

      let seriesData;
      if (traceGraph.get('source') === 'predicted') {
        seriesData = this.getPredictedSeriesData(traceGraph, props.data);
      } else {
        seriesData = props.data.reduce((result, point) => {
          result.unshift(point.get(trace.trace));
          return result;
        }, []);
      }

      series[idx] = {
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
        data: seriesData,
      };
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

  getPredictedSeriesData(traceGraph, data) {
    let predictedSeries = [];
    if (!data.size) {
      return predictedSeries;
    }

    let trace = find(PREDICTED_TRACES, {trace: traceGraph.get('trace')}) || null;

    if (!this.predictedData.hasOwnProperty(trace.trace) || this.predictedData[trace.trace].size === 0) {
      return predictedSeries;
    }
    let predictedData = this.predictedData[trace.trace];

    data.valueSeq().forEach((dataElem, idx) => {
      predictedSeries[idx] = this.findClosestPredictedDataByTimetamp(dataElem.get('timestamp'), predictedData, trace);
    });

    return predictedSeries.reverse();
  }

  findClosestPredictedDataByTimetamp(timestamp, data, predictedTrace) {
    let curr = data.first();

    let diff = Math.abs(timestamp - curr.get('timestamp'));

    data.valueSeq().forEach(dataElem => {
      let newdiff = Math.abs(timestamp - dataElem.get('timestamp'));
      if (newdiff < diff) {
        diff = newdiff;
        curr = dataElem;
      }
    });

    return curr.get(predictedTrace.path);
  }

  getTraces(props) {
    let series = [];

    props.traceGraphs.valueSeq().forEach(traceGraph => {
      let trace;
      if (traceGraph.get('source') === 'predicted') {
        trace = find(PREDICTED_TRACES, {trace: traceGraph.get('trace')}) || null;
      } else {
        trace = find(props.supportedTraces, {trace: traceGraph.get('trace')}) || null;
      }

      if (!trace) {
        series.push({
          valid: false,
          field: '',
          title: '',
          source: '',
          unit: '',
          type: 'line',
          dashStyle: 'Solid',
          lineWidth: 2,
          minValue: undefined,
          maxValue: undefined,
          latestValue: '--',
          color: traceGraph.get('color'),
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
      let latestValue;
      if (traceGraph.get('source') !== 'predicted') {
        latestValue = props.latestData ? props.latestData.getIn(['data', trace.trace], '') : null;
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
      } else {
        if (this.predictedData[trace.trace]) {
          latestValue = this.predictedData[trace.trace].last().get(trace.path).formatNumeral("0,0.00");
        }
      }

      latestValue = latestValue || '-';

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
        latestValue,
        source: traceGraph.get('source'),
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
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSubscribe: PropTypes.func.isRequired,
};

export default TracesChartColumn;
