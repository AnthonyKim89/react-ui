import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
//import Highcharts from 'highcharts';
import moment from 'moment';
import { STATE_CATEGORY_MAP, ACTIVITY_COLORS } from './constants';

import Convert from '../../../common/Convert';

import './TracesDepthBar.css';

class TracesDepthBar extends Component {

  componentDidMount() {
    /*const chart = Highcharts.chart(this.container, {
      chart: {
        type: 'scatter',
        backgroundColor: '#000',
        plotBackgroundColor: '#000',
        spacing: [0, 0, 0, 0],
        style: {overflow: 'visible'},
        animation: false,
      },
      plotOptions: {
        series: {
          turboThreshold: 5000,
          stacking: 'normal'
        },
        column: {
          groupPadding: 0,
          borderWidth: 0
        }
      },
      xAxis: {
        categories: ['state'],
        gridLineWidth: 0,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          enabled: false,
        }
      },
      yAxis: [{
        id: 'depthAxis',
        type: 'linear',
        reversed: true,
        gridLineWidth: 0,
        title: {enabled: false},
        labels: {
          style: {
            color: '#fff',
            margin: '10px',
          },
          formatter: function() {
            return parseFloat(this.value).toFixed();
          }
        },
        showFirstLabel: false,
        showLastLabel: false,
        // TODO: Figure out a proper tick interval once we get real data
        tickInterval: 2,
      }, {
        id: 'timeAxis',
        type: 'datetime',
        gridLineWidth: 0,
        reversed: true,
        title: {enabled: false},
        labels: {
          style: {
            color: '#fff',
            margin: '10px',
          },
          formatter: function() {
            return moment.unix(this.value).format('H:mm');
          }
        },
        showFirstLabel: false,
        showLastLabel: false,
        tickInterval: 20,
      }],
      title: {text: null},
      credits: {enabled: false},
      legend: {enabled: false},
      series: [{
        id: 'series',
        data: [],
        animation: false
      }]
    });
    this.setState({chart});*/
  }

  componentWillReceiveProps(newProps) {
    /*const chart = this.state.chart;

    const firstSummary = newProps.data.first();
    const lastSummary = newProps.data.last();

    const timeAxis = chart.get('timeAxis');
    const minTime = firstSummary.get('timestamp');
    const maxTime = lastSummary.get('timestamp');
    timeAxis.update({min: minTime, max: maxTime});

    const depthAxis = chart.get('depthAxis');
    const minDepth = firstSummary.get('hole_depth');
    const maxDepth = lastSummary.get('hole_depth');
    depthAxis.update({min: minDepth, max: maxDepth});*/
  }

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
        <div className="c-traces__depth-bar__chart__highchart" ref={container => this.container = container}>
        </div>
        <div className="c-traces__depth-bar__chart__bar">
          {this.props.data.map((point, idx) => {
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
