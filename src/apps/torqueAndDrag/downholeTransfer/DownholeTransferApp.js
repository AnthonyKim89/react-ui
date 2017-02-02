import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
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
            <div className="c-tnd-downhole-transfer__unit">kft-lbf</div>
          </th>
          <td>{data.getIn(['surface', 'torque'])}</td>
          <td className={`c-tnd-downhole-transfer__efficiency
                          c-tnd-downhole-transfer--${data.get('torque_efficiency')}`}>
            <Glyphicon glyph="arrow-right"
                       className="c-tnd-downhole-transfer__efficiency-arrow" />
            <div className="c-tnd-downhole-transfer__efficiency-message">
              {data.get('torque_efficiency')}
            </div>
          </td>
          <td className={`c-tnd-downhole-transfer--${data.get('torque_efficiency')}`}>
            {data.getIn(['downhole', 'torque'])}
          </td>
        </tr>
        <tr>
          <th>
            WOB
            <div className="c-tnd-downhole-transfer__unit">klbf</div>
          </th>
          <td>{data.getIn(['surface', 'weight_on_bit'])}</td>
          <td className={`c-tnd-downhole-transfer__efficiency
                          c-tnd-downhole-transfer--${data.get('weight_on_bit_efficiency')}`}>
            <Glyphicon glyph="arrow-right"
                       className="c-tnd-downhole-transfer__efficiency-arrow" />
            <div className="c-tnd-downhole-transfer__efficiency-message">
              {data.get('weight_on_bit_efficiency')}
            </div>
          </td>
          <td className={`c-tnd-downhole-transfer--${data.getIn(['weight_on_bit_efficiency'])}`}>
            {data.getIn(['downhole', 'weight_on_bit'])}
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
