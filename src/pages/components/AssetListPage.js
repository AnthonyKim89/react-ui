import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { format as formatDate } from 'date-fns';

import AssetListTabBar from './AssetListTabBar';
import { listAssets } from '../actions';
import { assetList } from '../selectors';

import './AssetListPage.css';

class AssetListPage extends Component {

  componentDidMount() {
    this.props.listAssets(this.props.params.assetType);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.assetType !== this.props.params.assetType) {
      this.props.listAssets(newProps.params.assetType);
    }
  }

  render() {
    return <div className="c-asset-list-page">
      <AssetListTabBar />
      <Table className="c-asset-list-page__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.assetList.map(asset => (
            <tr key={asset.get('id')}>
              <td>
                <Link to={`/assets/${asset.get('id')}/overview`} className="c-asset-list-page__asset-link">
                  {asset.get('name')}
                </Link>
              </td>
              <td>{asset.get('status')}</td>
              <td>{this.formatDate(asset.get('date'))}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>;
  }

  formatDate(date) {
    if (date) {
      return formatDate(date, 'MM/DD/YYYY');
    } else {
      return '';
    }
  }

}

export default connect(
  createStructuredSelector({
    assetList
  }),
  {
    listAssets
  }
)(AssetListPage);