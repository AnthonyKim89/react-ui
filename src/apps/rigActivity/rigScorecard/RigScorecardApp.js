import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as _ from 'lodash';
import { fromJS, Map, List } from 'immutable';
import { Size } from '../../../common/constants';

import * as api from '../../../api';

import { /*, METADATA*/ } from './constants';
import ColumnChart from '../../../common/ColumnChart';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './RigScorecardApp.css';

class RigScorecardApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Map()
    };
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      this.readyToRender() ?
        <div className="c-ra-rig-scorecard">
          <div className="row chart-panel">
            <div className="col s12">
              <ColumnChart
                title="Rank By Week"
                titleStyle={{ color: "#fff", fontWeight: "bold", fontSize: "15px", fontFamily: "orgonlightregular" }}
                data={this.getGraphData()}
                yAxisLabelsEnabled={true}
                yAxisTitle={{ text: "Rank", style: { color: '#fff', fontWeight: "bold", fontFamily: "orgonlightregular" } }}
                yAxisReversed={true}
                yAxisLineWidth="2"
                legendEnabled={false}
                tooltipPointFormat="score: {point.y}">
              </ColumnChart>
            </div>
          </div>
          <div className={(this.props.size !== Size.XLARGE) ? 'row action-panel action-panel-clipped' : 'row action-panel action-panel-scroll'}>
            <div className="col s12">
              <table className="chart-table">
                <thead>
                  <tr>
                    <th data-field="rank">Rank</th>
                    <th data-field="rigName">Rig Name</th>
                    <th data-field="ftPerDay">Ft/Day</th>
                    <th data-field="npt">NPT%</th>
                    <th data-field="failures">Failures</th>
                    <th data-field="score">Score</th>
                  </tr>
                </thead>
                <tbody class="c-ra-rig-scorecard__rows">
                  {this.state.data.map((h, order) =>
                    <tr key={h.get('asset_id')}>
                      <td className="rank">{order + 1}</td>
                      <td>{h.getIn(['data', 'asset_name'])}</td>
                      <td>{h.getIn(['data', 'ft_per_day'])}</td>
                      <td>{h.getIn(['data', 'npt'])}</td>
                      <td>{h.getIn(['data', 'failures'])}</td>
                      <td className={order===0?"green-text":""}>{h.getIn(['data', 'score'])}</td>
                    </tr>
                  )}
                </tbody>
              </table>  
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  readyToRender() {
    return this.state.data && this.state.data.count() > 0;
  }

  getFakeData(rigs) {
    let data = rigs.map(rig => (
      fromJS({
        asset_id: rig.get('id'),
        data: {
          asset_name: rig.get('name'),
          ft_per_day: Math.floor(2345 + 1000*Math.random()),
          npt: Math.floor(48 + 10*Math.random()),
          failures: Math.floor(5*Math.random())
        }
      })
    ));
    return data;
  }

  calculateScore(data) {
    data = data.map(h => {
      const ft_per_day = h.getIn(['data', 'ft_per_day']);
      const npt = h.getIn(['data', 'npt']);
      const failures = h.getIn(['data', 'failures']);
      let score = 10000/ft_per_day + npt/100*5 + failures;
      score = Math.round(score*10) / 10;
      h = h.setIn(['data', 'score'], score);
      return h;
    });
    data = data.sortBy(h => h.getIn(['data', 'score']));
    return data;
  }

  async getData() {
    let rigs = await api.getAssets(['rig']);
    let data;
    // let data = await api.getAppStorage(METADATA.provider, METADATA.collection, null, Map({
    //   query: '{asset_id#in#[' + rigs.map(x => x.get('id')).toArray().toString() + ']}',
    //   limit: 1000
    // }));
    data = this.getFakeData(rigs);
    data = this.calculateScore(data);
    this.setState({data, rigs});
  }

  getGraphData() {
    return List([Map({
      name: 'rank',
      data: this.state.data.map(h => (
        Map({
          y: h.getIn(['data', 'score']),
          name: h.getIn(['data', 'asset_name']),
          color: '#60AFF4'
        })
      ))
    })]);
  }
}

RigScorecardApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphType: PropTypes.number,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default RigScorecardApp;
