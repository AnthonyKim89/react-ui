import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';

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
    return <table>
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
          <th>TOR kft-lbf</th>
          <td>{data.getIn(['surface', 'torque'])}</td>
          <td>{data.get('torque_efficiency')}</td>
          <td>{data.getIn(['downhole', 'torque'])}</td>
        </tr>
        <tr>
          <th>WOB klbf</th>
          <td>{data.getIn(['surface', 'weight_on_bit'])}</td>
          <td>{data.get('weight_on_bit_efficiency')}</td>
          <td>{data.getIn(['downhole', 'weight_on_bit'])}</td>
        </tr>
      </tbody>
    </table>;
  }

  getSubscriptionData() {
    return this.props.data && this.props.data.get(SUBSCRIPTIONS[0]);
  }

}

DownholeTransferApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default DownholeTransferApp;
