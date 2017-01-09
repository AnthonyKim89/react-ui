import React, { Component } from 'react';
import { Col, FormControl, Glyphicon, Grid, InputGroup, Row, Table } from 'react-bootstrap';
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
      <Grid>
        <Row>
          <Col md={1} sm={0} />
          <Col md={10} sm={12}>
            <InputGroup className="c-asset-list-page__search">
              <InputGroup.Addon>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
              <FormControl type="search"
                           placeholder={`Search for ${this.props.params.assetType}...`}
                           value={this.props.location.query.search || ''}
                           onInput={e => this.onSearchChange(e.target.value)}
                           onChange={e => this.onSearchChange(e.target.value)} />
            </InputGroup>
          </Col>
          <Col md={1} sm={0} />
        </Row>
        <Row>
          <Col sm={12}>
            {this.props.assetList.isEmpty() ?
              <div className="c-asset-list-page__no-assets">No matching assets</div> :
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
            </Table>}
          </Col>
        </Row>
      </Grid>
    </div>;
  }

  formatDate(date) {
    if (date) {
      return formatDate(date, 'MM/DD/YYYY');
    } else {
      return '';
    }
  }

  onSearchChange(search) {
    this.props.router.push({
      pathname: `/assets/${this.props.params.assetType}`,
      query: {search}
    });
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