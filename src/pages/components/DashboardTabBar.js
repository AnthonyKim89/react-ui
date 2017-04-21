import React, { Component } from 'react';
import { Link } from 'react-router';
import { Input, Icon, NavItem, Button, Row, Col, Dropdown } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-modal';
import NotificationSystem from 'react-notification-system';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { store } from '../../store';
import login from '../../login';
import pages from '../../pages';
import { dashboards } from '../selectors';
import * as api from '../../api';

import './DashboardTabBar.css';

class DashboardTabBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardDialogOpen: false,
      dashboardDialogMode: 'Add', // or 'Edit'
      deleteDialogOpen: false,
    };
    this.saveDashboard = this.saveDashboard.bind(this);
  }

  render() {
    return <div>
      <ul className="c-dashboard-tab-bar">
        {dashboards(store.getState()).map(dashboard =>
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
                 defaultValue={this.state.dashboardDialogMode === 'Edit' ? this.props.currentDashboard.get('name') : ""}
                 ref={(input) => this.dashboardNameInput = input} />
          <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__done" onClick={() => this.saveDashboard()}>
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

    let slugAppend = 1;
    while (true) {
      if (this.props.dashboards.find(db => db.get('slug') === slug + "-" + slugAppend) === undefined) {
        slug = slug + "-" + slugAppend;
        break;
      }
      slugAppend++;
    }
    return slug;
  }

  async saveDashboard() {
    let userId = this.props.currentUser.get('id');
    let dashboard = {
      name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
      type: 'dashboard',
      layout: 'grid',
      settings: {},
      app_set_owner_id: userId,
      app_set_owner_type: 'User',
    };

    if (dashboard.name === "") {
      this.refs.notificationSystem.addNotification({
        message: "'Dashboard Name' is a required field.",
        level: 'error'
      });
      return;
    }

    dashboard.slug = this.getUniqueSlug(dashboard.name);

    let response;
    if (this.state.dashboardDialogMode === 'Edit') {
      //let dashboardId = this.state.deleteDialogEntity.get("id");
    } else {
      response = await api.postAppSet(userId, dashboard);
    }

    this.closeDashboardDialog();
    this.props.initNewDashboard(response);
  }

  async deleteDashboard() {
    //let dashboardId = this.state.deleteDialogEntity.get("id");
    this.closeDeleteDialog();
  }

  openDashboardDialog(mode='Add') {
    console.log(this.props.dashboards.toJS());

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

  openDeleteDialog(dashboard) {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  closeDeleteDialog() {
    this.setState({deleteDialogOpen: false});
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
    initNewDashboard: pages.actions.initNewDashboard,
  }
)(DashboardTabBar);
