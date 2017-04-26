import React, { Component } from 'react';
import { Row, Col, Table, Input, Icon, Dropdown, NavItem, Button } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { format as formatDate } from 'date-fns';
import Modal from 'react-modal';
import NotificationSystem from 'react-notification-system';

import AssetListTabBar from './AssetListTabBar';
import assets from '../../assets';
import login from '../../login';
import * as api from '../../api';

import './AssetListPage.css';

class AssetListPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      assetDialogOpen: false,
      assetDialogMode: 'Add', // or 'Edit'
      assetDialogEditAsset: null,
      deleteDialogOpen: false,
      assetDialogDeleteAsset: null,
    };
    this.saveAsset = this.saveAsset.bind(this);
  }

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
      <Row>
        <Col s={2} />
        <Col s={8}>
          <Input s={12}
                 label={`Search for ${this.props.params.assetType}...`}
                 value={this.props.location.query.search || ''}
                 onInput={e => this.onSearchChange(e.target.value)}
                 onChange={e => this.onSearchChange(e.target.value)}>
            <Icon>search</Icon>
          </Input>
        </Col>
        <Col s={2} />
      </Row>
      <Row>
        <Col s={2} />
        <Col s={8}>
          <Table className="c-asset-list-page__table">
            <thead>
              <tr>
                <th>
                  <Link to={this.makeSortLink('name')} className="c-asset-list-page__sort-link">
                    Name
                    {this.renderSortIcon('name')}
                  </Link>
                </th>
                {this.props.assetList.get('parentTypes').entrySeq().map(([typeCode, assetType]) => (
                  <th key={typeCode}>
                    <Link to={this.makeSortLink(typeCode)} className="c-asset-list-page__sort-link">
                      {assetType.get('labelSingular')}
                      {this.renderSortIcon(typeCode)}
                    </Link>
                  </th>
                ))}
                <th>
                  <Link to={this.makeSortLink('status')} className="c-asset-list-page__sort-link">
                    Status
                    {this.renderSortIcon('status')}
                  </Link>
                </th>
                <th>
                  <Link to={this.makeSortLink('date')} className="c-asset-list-page__sort-link">
                    Date
                    {this.renderSortIcon('date')}
                  </Link>
                </th>
                <th className="c-asset-list-page__add-asset-column">
                  <NavItem onClick={() => this.openAssetDialog('Add')} className="c-asset-list-page__add-asset-column__icon"><Icon>add_circle_outline</Icon></NavItem>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.assetList.get('assets').map(asset => (
                <tr key={asset.get('id')}>
                  <td>
                    {this.isAssetTypeLinkable() ?
                      <Link to={`/assets/${asset.get('id')}/overview`}
                            className="c-asset-list-page__asset-link">
                        {asset.get('name')}
                      </Link> :
                      asset.get('name')}
                  </td>
                  {this.props.assetList.get('parentTypes').keySeq().map(typeCode => (
                    <td key={asset.get('id') + typeCode}>
                      {asset.getIn(['parents', typeCode, 'name'])}
                    </td>
                  ))}
                  <td><assets.components.AssetStatus asset={asset} /></td>
                  <td>{this.formatDate(asset.get('date'))}</td>
                  <td className="c-asset-list-page__modify-asset-menu">
                    <Dropdown trigger={<NavItem><Icon>keyboard_arrow_down</Icon></NavItem>}>
                      <NavItem onClick={() => this.openAssetDialog('Edit', asset)}>Edit</NavItem>
                      <NavItem onClick={() => this.promptDeleteAsset(asset)}>Delete</NavItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
        </Table>
        {this.props.assetList.get('assets').isEmpty() &&
          <div className="c-asset-list-page__no-assets">No matching assets</div>}
        </Col>
        <Col s={2}>
        </Col>
      </Row>
      <Modal
        isOpen={this.state.assetDialogOpen}
        onRequestClose={() => this.closeAssetDialog()}
        className='c-asset-list-page__edit-asset'
        overlayClassName='c-asset-list-page__edit-asset__overlay'
        contentLabel={this.state.assetDialogMode.toUpperCase() + " Asset"}>
        <div className="c-asset-list-page__edit-asset__dialog">
          <header>
            <h4 className="c-asset-list-page__edit-asset__dialog__title">
              {this.state.assetDialogMode + " Asset"}
            </h4>
          </header>
          <Input label="Asset Name"
                 defaultValue={this.state.assetDialogEditAsset && this.state.assetDialogEditAsset.get('name')}
                 ref={(input) => this.assetNameInput = input} />
          {this.props.params.assetType !== 'program' && this.renderParentAssetSelector()}
          <Button className="c-asset-list-page__edit-asset__dialog__done" onClick={() => this.saveAsset()}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={this.state.deleteDialogOpen}
        onRequestClose={() => this.closeDeleteDialog()}
        className='c-asset-list-page__edit-asset'
        overlayClassName='c-asset-list-page__edit-asset__overlay'
        contentLabel="Delete Asset?">
        <div className="c-asset-list-page__edit-asset__dialog">
          <header>
            <h4 className="c-asset-list-page__edit-asset__dialog__title">
              Delete Asset?
            </h4>
          </header>
          <h5>Do you wish to delete this asset?</h5>
          <h5>Name: <span className="c-asset-list-page__edit-asset__bold">{this.state.assetDialogDeleteAsset && this.state.assetDialogDeleteAsset.get("name")}</span></h5>
          <Row className="c-asset-list-page__edit-asset__dialog__button-row">
            <Col s={6}>
              <Button className="c-asset-list-page__edit-asset__dialog__done" onClick={() => this.deleteAsset()}>
                Delete
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-asset-list-page__edit-asset__dialog__cancel" onClick={() => this.closeDeleteDialog()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <NotificationSystem ref="notificationSystem" noAnimation={true} />
    </div>;
  }

  async saveAsset() {
    let asset = {
      name: this.assetNameInput.state.value ? this.assetNameInput.state.value.trim() : "",
      parent_asset_id: this.parentAssetSelector ? parseInt(this.parentAssetSelector.state.value, 10) : null,
    };

    if (this.props.params.assetType !== 'program' && !asset.parent_asset_id) {
      asset.parent_asset_id = this.props.possibleParentAssets.first().get("id");
    }

    if (asset.name === "") {
      this.refs.notificationSystem.addNotification({
        message: "'Asset Name' is a required field.",
        level: 'error'
      });
      return;
    }

    let response = null;
    if (this.state.assetDialogMode === 'Edit') {
      let assetId = this.state.assetDialogEditAsset.get("id");
      response = await api.putAsset(assetId, asset);
    } else {
      asset = Object.assign(asset, {
        asset_type: this.props.params.assetType,
        type: "Asset::" + this.props.params.assetType[0].toUpperCase() + this.props.params.assetType.slice(1),
        company_id: this.props.currentUser.get("company_id"),
      });
      response = await api.postAsset(asset);
    }

    this.closeAssetDialog();
    this.props.reloadAsset(response.get("id"));
  }

  async promptDeleteAsset(asset) {
    let childType = null;
    if (this.props.params.assetType === 'program') {
      childType = 'rig';
    } else if (this.props.params.assetType === 'rig') {
      childType = 'well';
    }

    // Looking up any possible children of this item. If it has children, we show an error and return.
    if (childType !== null) {
      let possibleChildren = await api.getAssets([childType]);
      let hasChildren = false;
      possibleChildren.valueSeq().forEach((a) => {
        if (hasChildren || a.get("parent_asset_id") === asset.get("id")) {
          hasChildren = true;
        }
      });
      if (hasChildren) {
        this.refs.notificationSystem.addNotification({
          message: 'The asset you are attempting to delete contains one or more children. You must first delete/reassign any children it contains.',
          level: 'error'
        });
        return;
      }
    }

    this.openDeleteDialog(asset);
  }

  async deleteAsset() {
    let assetId = this.state.assetDialogDeleteAsset.get("id");
    try {
      await api.deleteAsset(assetId);
      this.props.unloadAsset(assetId);
    } catch (e) {
      console.log(e);
      this.refs.notificationSystem.addNotification({
        message: 'Unable to delete the selected asset.',
        level: 'error'
      });
    }

    this.closeDeleteDialog();
  }

  openAssetDialog(mode='Add', asset=null) {
    if (this.props.params.assetType !== 'program' && this.props.possibleParentAssets.count() === 0) {
      this.refs.notificationSystem.addNotification({
        message: "Before you can add an asset of this type, you must first add a parent " + (this.props.params.assetType === "rig" ? "Program." : "Rig."),
        level: 'error'
      });
      return;
    }

    this.setState({
      assetDialogOpen: true,
      assetDialogMode: mode,
      assetDialogEditAsset: asset,
    });
  }

  closeAssetDialog() {
    this.setState({assetDialogOpen: false});
  }

  openDeleteDialog(asset) {
    this.setState({
      deleteDialogOpen: true,
      assetDialogDeleteAsset: asset,
    });
  }

  closeDeleteDialog() {
    this.setState({deleteDialogOpen: false});
  }

  makeSortLink(sortField) {
    const {sortField: currentField, sortOrder: currentOrder} = this.props.location.query;
    const isThisField = sortField === currentField || (sortField === 'name' && !currentField);
    const isAscending = currentOrder === 'asc' || !currentOrder;
    const sortOrder = (isThisField && isAscending ? 'desc' : 'asc');
    return {
      pathname: `/assets/${this.props.params.assetType}`,
      query: {...this.props.location.query, sortField, sortOrder}
    };
  }

  renderParentAssetSelector() {
    let parentType = this.props.assetList.get('parentTypes').entrySeq().map(([_, assetType]) => {return assetType.get('labelSingular');}).first();
    let currentParent;
    if (this.state.assetDialogEditAsset !== null) {
      currentParent = this.state.assetDialogEditAsset.get("parents").first();
    }
    return (
      <Input
        type="select"
        ref={(input) => this.parentAssetSelector = input}
        label={"Parent Asset (" + parentType + ")"}
        defaultValue={currentParent ? currentParent.get("id") : undefined}
        onChange={this.changeParent} >
        {this.props.possibleParentAssets.map(asset =>
          <option value={asset.get('id')} key={asset.get('id')}>
            {asset.get('name')}
          </option>
        )}
      </Input>
    );
  }

  renderSortIcon(sortField) {
    const {sortField: currentField, sortOrder: currentOrder} = this.props.location.query;
    if (sortField === currentField || (sortField === 'name' && !currentField)) {
      return <Icon className="c-asset-list-page__sort-icon">{currentOrder === 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</Icon>;
    } else {
      return null;
    }
  }

  isAssetTypeLinkable() {
    return assets.constants.ASSET_TYPES.getIn([this.props.params.assetType, 'hasAssetPage']);
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
      query: {...this.props.location.query, search}
    });
  }
}

export default connect(
  createStructuredSelector({
    assetList: assets.selectors.assetList,
    currentUser: login.selectors.currentUser,
    possibleParentAssets: assets.selectors.possibleParentAssets,
  }),
  {
    listAssets: assets.actions.listAssets,
    reloadAsset: assets.actions.reloadAsset,
    unloadAsset: assets.actions.unloadAsset,
  }
)(AssetListPage);