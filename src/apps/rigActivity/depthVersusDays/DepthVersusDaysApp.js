import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import * as _ from 'lodash';
import { fromJS, Map } from 'immutable';

import * as api from '../../../api';

import { GRAPH_TYPES/*, METADATA*/ } from './constants';
import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './DepthVersusDaysApp.css';

class DepthVersusDaysApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Map()
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.graphType !== nextProps.graphType) {
      this.getData();
    }
  }

  render() {
    return (
      this.readyToRender() ?
        <div className="c-ra-depth-versus-days">
          <div className="row chart-panel">
            <div className="col s12">
              <Chart
                xField="day"
                xAxisTitle={{text: "Time(days)", style: { color: '#fff' }}}
                horizontal={true}
                size={this.props.size}
                widthCols={this.props.widthCols}
                yAxisReversed={true}
                plotBackgroundColor="rgb(32,31,31)"
                yGridLineWidth="0"
                xAxisMinorTickInterval={1}
                xAxisTickInterval={2}
                xAxisGridLineDashStyle="Dash"
                xAxisMinorGridLineDashStyle="Dash">
                {this.getSeries().map(({renderType, key, title, yAxisTitle, data}) => (
                  <ChartSeries
                    key={key}
                    id={key}
                    type={renderType}
                    title={title}
                    yAxisTitle={yAxisTitle}
                    data={data}
                    yField="depth" />
                ))}
              </Chart>
            </div>
          </div>
          <div className="row action-panel">
            <div className="col s12">
              <Input
                className="select-period"
                type="select"
                value={this.props.graphType}
                onChange={e => this.onChangeGraphType(e)}>
                {GRAPH_TYPES.map(item =>
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

  onChangeGraphType(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('graphType', currentValue);
  }

  getFakeData() {
    let data = [];
    for (let i=1;i<=3;i++) {
      let prev_depth = 0;
      for (let j=1;j<=20;j++) {
        prev_depth += 1000*Math.random();
        data.push({
          asset_id: i,
          data: {
            day: j,
            depth: prev_depth
          }
        });        
      }
    }
    let rigs = [
      {
        id: 1,
        name: 'rig 1'
      },
      {
        id: 2,
        name: 'rig 2'
      },
      {
        id: 3,
        name: 'rig 3'
      }
    ];
    return [fromJS(data), fromJS(rigs)];
  }

  async getData() {
    let rigs = await api.getAssets(['rig']);
    let data;
    // let data = await api.getAppStorage(METADATA.provider, METADATA.collection, null, Map({
    //   query: '{asset_id#in#[' + rigs.map(x => x.get('id')).toArray().toString() + ']}',
    //   limit: 1000
    // }));
    [data, rigs] = this.getFakeData();
    this.setState({data, rigs});
  }

  getSeries() {
    let series = [];
    for (let asset_id=1;asset_id<=3;asset_id++) {
      let asset_data = this.state.data.filter(x => x.get('asset_id') === asset_id).map(x => (
        Map({
          day: x.getIn(['data', 'day']),
          depth: x.getIn(['data', 'depth'])
        })
      ));
      const title = this.state.rigs.find((x) => x.get('id') === asset_id).get('name');
      series.push({
        renderType: 'line',
        key: 'rig' + asset_id,
        title: title,
        yAxisTitle: { 
          text: "Depth(HD-ft)", 
          style: { color: '#fff' } 
        },
        data: asset_data
      });
    }
    return series;
  }
}

DepthVersusDaysApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphType: PropTypes.number,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default DepthVersusDaysApp;
