import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { fromJS, List, Map } from 'immutable';

import * as api from '../../../api';

import { PERIOD_TYPES, SUPPORTED_CHART_SERIES, METADATA } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './RopPerformanceApp.css';

class RopPerformanceApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: List()
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.getData(this.props.asset);      
    }
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || 
    nextProps.coordinates !== this.props.coordinates || 
    nextProps.graphColors !== this.props.graphColors ||
    nextProps.period !== this.props.period ||
    nextProps.ropType !== this.props.ropType);
  }
  */

  render() {
    return (
      this.readyToRender() ?
        <div className="c-ra-rop-performance">
          <div className="row chart-panel">
            <div className="col s12">
              <Chart
                xField="day"
                xAxisType="datetime"
                xAxisWidth="2"
                xAxisColor="#bbb"                
                xLabelStyle={{color: '#bbb'}}
                xAxisLabelFormatter={(value) => {
                  return Math.floor((Date.now() - value) / 1000 / 60 / 60 / 24);
                }}
                showFirstXLabel={true}
                showLastXLabel={true}
                tooltipPointFormat={`<b>{point.y}</b> ft/hr`}
                horizontal={true}
                multiAxis={false}
                size={this.props.size}
                coordinates={this.props.coordinates}
                plotBackgroundColor='rgb(32, 31, 31)'
                gridLineWidth='0px'
                hideYAxis={true}
                legendAlign='center'
                legendVerticalAlign='bottom'
                legendLayout='horizontal'
                showLegend={true}
                forceLegend={true}
                widthCols={this.props.widthCols}>
                {this.getSeries().map(({renderType, key, title, data}) => (
                  <ChartSeries
                    key={key}
                    id={key}
                    type={renderType}
                    title={title}
                    data={data}
                    yField="value"
                    color={this.getSeriesColor(key)} />
                )).toJS()}
              </Chart>  
            </div>
          </div>
          <div className="row action-panel">
            <div className="col s12">
              <Input
                className="select-period"
                type="select"
                value={this.props.period}
                onChange={e => this.onChangePeriod(e)}>
                {PERIOD_TYPES.map(item =>
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                )}
              </Input>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  readyToRender() {
    return this.state.data && this.state.data.count() > 0;
  }

  onChangePeriod(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('period', currentValue);
  }

  getFakeData() {
    let data = [];
    let now = Date.now();
    for (let i=0;i<30;i++) {
      data.push({
        timestamp: now - i*24*60*60*1000,
        data: {
          day: {
            total_rop: Math.round(Math.random()*10 + 80),
            drilling_rop: Math.round(Math.random()*10 + 100)
          },
          night: {
            total_rop: Math.round(Math.random()*10 + 50),
            drilling_rop: Math.round(Math.random()*10 + 80)
          }
        }
      });
    }
    return fromJS(data);
  }

  async getData(asset) {
    const to = Math.floor(Date.now() / 1000);
    const from = to - this.props.period*24*60*60;
    let data = await api.getAppStorage(METADATA.provider, METADATA.collection, asset.get('id'), Map({
      query: '{timestamp#gte#' + from + '}AND{timestamp#lte#' + to + '}'
    }));
    this.setState({
      data: data
    });
  }

  getSeries() {
    return List([this.getSeriesByShift('day'), this.getSeriesByShift('night')]);
  }

  getSeriesByShift(shift) {     
    const ropType = this.props.ropType;                                                                                                                                                                                                                                                                  
    return {
      renderType: 'line',
      key: shift,
      title: SUPPORTED_CHART_SERIES[shift].label,
      data: List(this.state.data.map(record => {
        return Map({
          day: record.get('timestamp'),
          value: (record.getIn(['data', shift, "rop", ropType || 'gross']) || 0).fixFloat(2)
        });
      }))
    };
  }

  getSeriesColor(seriesType) {
    if (this.props.graphColors && this.props.graphColors.has(seriesType)) {
      return this.props.graphColors.get(seriesType);
    } else {
      return SUPPORTED_CHART_SERIES[seriesType].defaultColor;
    }
  }
}

RopPerformanceApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  ropType: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default RopPerformanceApp;
