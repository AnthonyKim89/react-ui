import React, { Component } from 'react';
import { Link } from 'react-router';
import { Input, Icon, NavItem, Button, Row, Col, Dropdown } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-modal';
import NotificationSystem from 'react-notification-system';
import ImmutablePropTypes from 'react-immutable-proptypes';

import login from '../../login';
import pages from '../../pages';
import * as api from '../../api';
import SortableComponent from '../../common/SortableComponent';

import './DashboardTabBar.css';

class DashboardTabBar extends Component {

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
      <ul className="c-dashboard-tab-bar">
        {this.props.dashboards.map(dashboard =>
          <li key={dashboard.get('id')}>
            <Link to={`/dashboards/${dashboard.get('slug')}`} className="c-dashboard-tab-bar__dashboard-link" activeClassName="is-active">
              {dashboard.get('name')}
            </Link>
          </li>)}
        <NavItem className="c-dashboard-tab-bar__dashboard-link c-dashboard-tab-bar__add-dashboard" onClick={() => this.openDashboardDialog()}>
          <Icon>add_circle_outline</Icon>
        </NavItem>
        <li className="c-dashboard-tab-bar__settings-menu"><ul>
          <Dropdown trigger={<NavItem><Icon>settings</Icon></NavItem>}>
            <NavItem onClick={() => this.openDashboardDialog('Edit')}>Edit</NavItem>
            <NavItem onClick={() => this.openDeleteDialog()}>Delete</NavItem>
            <NavItem onClick={() => this.openSortDialog()}>Sort</NavItem>
          </Dropdown>
        </ul></li>
      </ul>
      <Modal
        isOpen={this.state.dashboardDialogOpen}
        onRequestClose={() => this.closeDashboardDialog()}
        className='c-dashboard-tab-bar__edit-dashboard'
        overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
        contentLabel={this.state.dashboardDialogMode.toUpperCase() + " Dashboard"}>
        <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
              {this.state.dashboardDialogMode + " Dashboard"}
            </h4>
          </header>
          <Input label="Dashboard Name"
                 defaultValue={this.props.currentDashboard && this.state.dashboardDialogMode === 'Edit' ? this.props.currentDashboard.get('name') : ""}
                 ref={(input) => this.dashboardNameInput = input} />
          <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__done" onClick={() => this.saveDashboard()}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={this.state.sortDialogOpen}
        onRequestClose={() => this.closeSortDialog()}
        className='c-dashboard-tab-bar__edit-dashboard'
        overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
        contentLabel="Sort Dashboards">
        <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
              Sort Dashboards
            </h4>
          </header>
          <SortableComponent ref={(input) => this.dashboardList = input} items={this.props.dashboards} />
          <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__done" onClick={() => this.saveOrdering()}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={this.state.deleteDialogOpen}
        onRequestClose={() => this.closeDeleteDialog()}
        className='c-dashboard-tab-bar__edit-dashboard'
        overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
        contentLabel="Delete Dashboard?">
        <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
          <header>
            <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
              Delete Dashboard?
            </h4>
          </header>
          <h5>Do you wish to delete this dashboard?</h5>
          <h5>Name: <span className="c-dashboard-tab-bar__edit-dashboard__bold">{this.props.currentDashboard && this.props.currentDashboard.get("name")}</span></h5>
          <Row className="c-dashboard-tab-bar__edit-dashboard__dialog__button-row">
            <Col s={6}>
              <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__done" onClick={() => this.deleteDashboard()}>
                Delete
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__cancel" onClick={() => this.closeDeleteDialog()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <NotificationSystem ref="notificationSystem" noAnimation={true} />
    </div>;
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

      await api.putDashboard(userId, dashboardId, dashboard);
    }

    this.closeSortDialog();
    this.props.updateDashboards(this.props.currentDashboard);
  }

  getUniqueSlug(name) {
    let slug = name.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')        // Remove all non-word chars
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text

    let existingSlug = this.props.dashboards.find(db => db.get('slug') === slug);
    if (!existingSlug) {
      return slug;
    }

    return this.findUniqueSlug(slug, 1);
  }

  findUniqueSlug(slug, slugAppend) {
    if (this.props.dashboards.find(db => db.get('slug') === slug + "-" + slugAppend) === undefined) {
      return slug + "-" + slugAppend;
    }
    return this.findUniqueSlug(slug, slugAppend);
  }

  getNextOrder() {
    let highest = 0;
    this.props.dashboards.valueSeq().forEach(value => highest = Math.max(highest, value.get('order')));
    return highest+1;
  }

  async saveDashboard() {
    let userId = this.props.currentUser.get('id');

    let response;
    if (this.state.dashboardDialogMode === 'Edit') {
      let dashboard = {
        name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
      };
      response = await api.putDashboard(userId, this.props.currentDashboard.get('id'), dashboard);

    } else {
      let dashboard = {
        name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
        type: 'dashboard',
        layout: 'grid',
        settings: {},
        dashboard_owner_id: userId,
        dashboard_owner_type: 'User',
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
      response = await api.postDashboard(userId, dashboard);
    }

    this.closeDashboardDialog();
    this.props.updateDashboards(response);
  }

  async deleteDashboard() {
    let userId = this.props.currentUser.get('id');
    let dashboardId = this.props.currentDashboard.get('id');
    await api.deleteDashboard(userId, dashboardId);

    this.closeDeleteDialog();
    this.props.updateDashboards();
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

DashboardTabBar.propTypes = {
  currentDashboard: ImmutablePropTypes.map,
};

export default connect(
  createStructuredSelector({
    currentUser: login.selectors.currentUser,
    dashboards: pages.selectors.dashboards,
  }),
  {
    updateDashboards: pages.actions.updateDashboards,
  }
)(DashboardTabBar);
