import React, { Component } from 'react';
import { Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './DownholeTransferApp.css'

class DownholeTransferApp extends Component {

  render() {
    return (
      <div className="c-tnd-downhole-transfer">
        {this.getSubscriptionData() ?
          this.renderTable() :
          <LoadingIndicator />}
        
      </div>
    );
  }

  renderTable() {
    const data = this.getSubscriptionData().get('data');
    let forceUnit = this.props.convert.GetUserUnitPreference('force');
    let massUnit = this.props.convert.GetUserUnitPreference('mass');
    return <table className="c-tnd-downhole-transfer__table">
      <colgroup>
        <col style={{width: '25%'}}></col>
        <col style={{width: '25%'}}></col>
        <col style={{width: '25%'}}></col>
        <col style={{width: '25%'}}></col>
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <th>Surface</th>
          <th></th>
          <th>Downhole</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            TOR
            <div className="c-tnd-downhole-transfer__unit">k{forceUnit}</div>
          </th>
          <td>{this.props.convert.ConvertValue(data.getIn(['surface', 'torque']), 'force', 'lbf', forceUnit).fixFloat(1)}</td>
          <td className={`c-tnd-downhole-transfer__efficiency
                          c-tnd-downhole-transfer--${data.get('torque_efficiency')}`}>
            <Icon>play_arrow</Icon>
            <div className="c-tnd-downhole-transfer__efficiency-message">
              {data.get('torque_efficiency')}
            </div>
          </td>
          <td className={`c-tnd-downhole-transfer--${data.get('torque_efficiency')}`}>
            {this.props.convert.ConvertValue(data.getIn(['downhole', 'torque']), 'force', 'lbf', forceUnit).fixFloat(1)}
          </td>
        </tr>
        <tr>
          <th>
            WOB
            <div className="c-tnd-downhole-transfer__unit">k{massUnit}</div>
          </th>
          <td>{this.props.convert.ConvertValue(data.getIn(['surface', 'weight_on_bit']), 'force', 'lb', massUnit).fixFloat(1)}</td>
          <td className={`c-tnd-downhole-transfer__efficiency
                          c-tnd-downhole-transfer--${data.get('weight_on_bit_efficiency')}`}>
            <Icon>play_arrow</Icon>
            <div className="c-tnd-downhole-transfer__efficiency-message">
              {data.get('weight_on_bit_efficiency')}
            </div>
          </td>
          <td className={`c-tnd-downhole-transfer--${data.getIn(['weight_on_bit_efficiency'])}`}>
            {this.props.convert.ConvertValue(data.getIn(['downhole', 'weight_on_bit']), 'force', 'lb', massUnit).fixFloat(1)}
          </td>
        </tr>
      </tbody>
    </table>;
  }

  getSubscriptionData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

}

DownholeTransferApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default DownholeTransferApp;
