import React, { Component, PropTypes } from 'react';
import { Input, Icon, NavItem, Button, Row, Col, Dropdown } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-modal';
import { Link } from 'react-router';
import NotificationSystem from 'react-notification-system';
import ImmutablePropTypes from 'react-immutable-proptypes';

import login from '../../login';
import pages from '../../pages';
import * as api from '../../api';
import SortableComponent from '../../common/SortableComponent';

import './AssetTabBar.css';

class AssetTabBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardDialogOpen: false,
      dashboardDialogMode: 'Add', // or 'Edit'
      deleteDialogOpen: false,
      sortDialogOpen: false,
    };
    this.saveDashboard = this.saveDashboard.bind(this);
    this.saveOrdering = this.saveOrdering.bind(this);
  }

  render() {
    return <div>
      <ul className="c-asset-tab-bar">
        <li className="c-asset-tab-bar__Title-name"><span>Drilling</span><Icon className="c-asset-tab-bar__right-arrow">keyboard_arrow_right</Icon></li>
        {this.props.assetDashboards.map(tab => this.renderTab(tab))}
        <NavItem className="c-asset-tab-bar__dashboard-link c-asset-tab-bar__add-dashboard" onClick={() => this.openDashboardDialog()}>
          <Icon>add_circle_outline</Icon>
        </NavItem>
        <li className="c-asset-tab-bar__settings-menu"><ul>
          {!this.dashboardIsRestricted(this.props.currentAssetDashboard) &&
          <Dropdown trigger={<NavItem><Icon>settings</Icon></NavItem>}>
            <NavItem onClick={() => this.openDashboardDialog('Edit')}>Edit</NavItem>
            <NavItem onClick={() => this.openDeleteDialog()}>Delete</NavItem>
            <NavItem onClick={() => this.openSortDialog()}>Sort</NavItem>
          </Dropdown>}
          {this.dashboardIsRestricted(this.props.currentAssetDashboard) &&
          <Dropdown trigger={<NavItem><Icon>settings</Icon></NavItem>}>
            <NavItem onClick={() => this.openSortDialog()}>Sort</NavItem>
          </Dropdown>}
        </ul></li>
        {this.renderCurrentTabName()}
      </ul>
      <Modal
        isOpen={this.state.dashboardDialogOpen}
        onRequestClose={() => this.closeDashboardDialog()}
        className='c-asset-tab-bar__edit-dashboard'
        overlayClassName='c-asset-tab-bar__edit-dashboard__overlay'
        contentLabel={this.state.dashboardDialogMode.toUpperCase() + " Dashboard"}>
        <div className="c-asset-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-asset-tab-bar__edit-dashboard__dialog__title">
              {this.state.dashboardDialogMode + " Dashboard"}
            </h4>
          </header>
          <Input label="Dashboard Name"
                 defaultValue={this.props.currentAssetDashboard && this.state.dashboardDialogMode === 'Edit' ? this.props.currentAssetDashboard.get('name') : ""}
                 ref={(input) => this.dashboardNameInput = input} />
          <Input type='select' label="Dashboard Icon"
                 defaultValue={this.props.currentAssetDashboard && this.state.dashboardDialogMode === 'Edit' ? this.props.currentAssetDashboard.get('icon') : ""}
                 ref={(input) => this.dashboardIconInput = input}>
            <option value='none'>None</option>
            <option value='overview'>Overview</option>
            <option value='torqueAndDrag'>Torque & Drag</option>
            <option value='drilling-efficiency'>Drilling Efficiency</option>
            <option value='directional'>Directional</option>
            <option value='stability'>Stability</option>
            <option value='hydraulics'>Hydraulics</option>
            <option value='bit'>Bit</option>
            <option value='pdm'>PDM</option>
            <option value='losses'>Losses</option>
          </Input>
          <Input type='checkbox'
                 label='Show Well Timeline'
                 className='filled-in'
                 defaultValue={this.showControlAppsCheckedValue(true)}
                 defaultChecked={this.showControlAppsCheckedValue()}
                 ref={(input) => this.dashboardControlAppsInput = input}/>
          <Button className="c-asset-tab-bar__edit-dashboard__dialog__done" onClick={() => this.saveDashboard()}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={this.state.sortDialogOpen}
        onRequestClose={() => this.closeSortDialog()}
        className='c-asset-tab-bar__edit-dashboard'
        overlayClassName='c-asset-tab-bar__edit-dashboard__overlay'
        contentLabel="Sort Dashboards">
        <div className="c-asset-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-asset-tab-bar__edit-dashboard__dialog__title">
              Sort Dashboards
            </h4>
          </header>
          <SortableComponent ref={(input) => this.dashboardList = input} items={this.props.assetDashboards} />
          <Button className="c-asset-tab-bar__sort-dashboard__dialog__done" onClick={() => this.saveOrdering()}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={this.state.deleteDialogOpen}
        onRequestClose={() => this.closeDeleteDialog()}
        className='c-asset-tab-bar__edit-dashboard'
        overlayClassName='c-asset-tab-bar__edit-dashboard__overlay'
        contentLabel="Delete Dashboard?">
        <div className="c-asset-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-asset-tab-bar__edit-dashboard__dialog__title">
              Delete Dashboard?
            </h4>
          </header>
          <h5>Do you wish to delete this dashboard?</h5>
          <h5>Name: <span className="c-asset-tab-bar__edit-dashboard__bold">{this.props.currentAssetDashboard && this.props.currentAssetDashboard.get("name")}</span></h5>
          <Row className="c-asset-tab-bar__edit-dashboard__dialog__button-row">
            <Col s={6}>
              <Button className="c-asset-tab-bar__delete-dashboard__dialog__done" onClick={() => this.deleteDashboard()}>
                Delete
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-asset-tab-bar__delete-dashboard__dialog__cancel" onClick={() => this.closeDeleteDialog()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <NotificationSystem ref="notificationSystem" noAnimation={true} />
    </div>;
  }

  showControlAppsCheckedValue(asBoolean=false) {
    if (this.state.dashboardDialogMode !== 'Edit' || !this.props.currentAssetDashboard) {
      return asBoolean ? true : 'checked';
    }
    let currentValue = this.props.currentAssetDashboard.getIn(['settings', 'show_control_apps']) ? 'checked' : '';
    if (asBoolean) {
      return (currentValue === 'checked');
    }
    return currentValue;
  }

  dashboardIsRestricted(dashboard) {
    if (!dashboard) {
      return true;
    }
    return ['traces', 'settings'].includes(dashboard.get("slug"));
  }

  renderTab(tab) {
    const icon = tab.get('icon');
    let className = icon ? `c-asset-tab-bar__${icon}-tab` : 'c-asset-tab-bar__first-letter-tab';

    return <li key={tab.get('id')} className={className}>
      <Link to={this.getLocation(tab.get('slug'))} activeClassName="is-active">
        {icon ? tab.get('name') : tab.get('name').charAt(0)}
      </Link>
    </li>;
  }

  renderCurrentTabName() {
    const title = this.props.currentAssetDashboard && this.props.currentAssetDashboard.get('name');
    return <li className="c-asset-tab-bar__current-tab-name">{title}</li>;
  }

  getLocation(slug) {
    return {
      pathname: `/assets/${this.props.assetId}/${slug}`,
      query: this.props.pageParams && this.props.pageParams.toJS()
    };
  }

  async saveOrdering() {
    let items = this.dashboardList.state.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].order === i) {
        continue;
      }

      let dashboardId = items[i].id;
      let userId = this.props.currentUser.get('id');
      let dashboard = {
        order: i
      };

      await api.putAppSet(userId, dashboardId, dashboard);
    }

    this.closeSortDialog();
    this.props.updateDashboards(this.props.currentAssetDashboard, this.props.assetId);
  }

  getUniqueSlug(name) {
    let slug = name.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')        // Remove all non-word chars
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text

    let existingSlug = this.props.assetDashboards.find(db => db.get('slug') === slug);
    if (!existingSlug) {
      return slug;
    }

    return this.findUniqueSlug(slug, 1);
  }

  findUniqueSlug(slug, slugAppend) {
    if (this.props.assetDashboards.find(db => db.get('slug') === slug + "-" + slugAppend) === undefined) {
      return slug + "-" + slugAppend;
    }
    return this.findUniqueSlug(slug, slugAppend);
  }

  getNextOrder() {
    let highest = 0;
    this.props.assetDashboards.valueSeq().forEach(value => highest = Math.max(highest, value.get('order')));
    return highest+1;
  }

  async saveDashboard() {
    let userId = this.props.currentUser.get('id');

    let response;
    if (this.state.dashboardDialogMode === 'Edit') {
      let dashboard = {
        name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
        icon: this.dashboardIconInput.state.value !== 'none' ? this.dashboardIconInput.state.value : null,
        settings: {show_control_apps: this.dashboardControlAppsInput.state.value === true},
      };
      response = await api.putAppSet(userId, this.props.currentAssetDashboard.get('id'), dashboard);

    } else {
      let dashboard = {
        name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
        icon: this.dashboardIconInput.state.value !== 'none' ? this.dashboardIconInput.state.value : null,
        settings: {show_control_apps: this.dashboardControlAppsInput.state.value === true},
        type: 'asset_dashboard',
        layout: 'grid',
        app_set_owner_id: userId,
        app_set_owner_type: 'User',
        order: this.getNextOrder(),
      };

      if (dashboard.name === "") {
        this.refs.notificationSystem.addNotification({
          message: "'Dashboard Name' is a required field.",
          level: 'error'
        });
        return;
      }

      dashboard.slug = this.getUniqueSlug(dashboard.name);
      response = await api.postAppSet(userId, dashboard);
    }

    this.closeDashboardDialog();
    this.props.updateDashboards(response, this.props.assetId);
  }

  async deleteDashboard() {
    let userId = this.props.currentUser.get('id');
    let dashboardId = this.props.currentAssetDashboard.get('id');
    await api.deleteAppSet(userId, dashboardId);

    this.closeDeleteDialog();
    this.props.updateDashboards(this.props.assetDashboards.first(), this.props.assetId);
  }

  openDashboardDialog(mode='Add') {
    this.setState({
      dashboardDialogOpen: true,
      dashboardDialogMode: mode,
    });
  }

  closeDashboardDialog() {
    this.setState({
      dashboardDialogOpen: false,
    });
  }

  openSortDialog() {
    this.setState({
      sortDialogOpen: true,
    });
  }

  closeSortDialog() {
    this.setState({
      sortDialogOpen: false
    });
  }

  openDeleteDialog() {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  closeDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
  }
}

AssetTabBar.propTypes = {
  assetId: PropTypes.number.isRequired,
  assetDashboards: ImmutablePropTypes.seq.isRequired,
  currentAssetDashboard: ImmutablePropTypes.map,
  pageParams: ImmutablePropTypes.map
};

export default connect(
  createStructuredSelector({
    currentUser: login.selectors.currentUser,
  }),
  {
    updateDashboards: pages.actions.updateDashboards,
  }
)(AssetTabBar);