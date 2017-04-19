import React, { Component } from 'react';
import { Link } from 'react-router';
import { store } from '../../store';
import { dashboards } from '../selectors';
import { Input, Icon, NavItem, Button, Row, Col } from 'react-materialize';
import Modal from 'react-modal';
import NotificationSystem from 'react-notification-system';

import './DashboardTabBar.css';

class DashboardTabBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardDialogOpen: false,
      dashboardDialogMode: 'Add', // or 'Edit'
      dashboardDialogEntity: null,
      deleteDialogOpen: false,
      deleteDialogEntity: null,
    };
    this.saveDashboard = this.saveDashboard.bind(this);
  }

  render() {
    return <div>
      <ul className="c-dashboard-tab-bar">
        {dashboards(store.getState()).map(dashboard =>
          <li key={dashboard.get('id')}>
            <Link to={`/dashboards/${dashboard.get('id')}`} className="c-dashboard-tab-bar__dashboard-link" activeClassName="is-active">
              {dashboard.get('name')}
            </Link>
            <div className="c-dashboard-tab-bar__dashboard-options">
              <a onClick={() => this.openDashboardDialog('Edit', dashboard)}><Icon>settings</Icon></a>
              <a onClick={() => this.openDeleteDialog(dashboard)}><Icon>delete</Icon></a>
            </div>
          </li>)}
        <NavItem className="c-dashboard-tab-bar__dashboard-link" onClick={() => this.openDashboardDialog()}><Icon>add_circle_outline</Icon></NavItem>
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
                 defaultValue={this.state.dashboardDialogEntity && this.state.dashboardDialogEntity.get('name')}
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
          <h5>Name: <span className="c-dashboard-tab-bar__edit-dashboard__bold">{this.state.deleteDialogEntity && this.state.deleteDialogEntity.get("name")}</span></h5>
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

  async saveDashboard() {
    let dashboard = {
      name: this.dashboardNameInput.state.value ? this.dashboardNameInput.state.value.trim() : "",
    };

    if (dashboard.name === "") {
      this.refs.notificationSystem.addNotification({
        message: "'Dashboard Name' is a required field.",
        level: 'error'
      });
      return;
    }

    if (this.state.dashboardDialogMode === 'Edit') {
      //let dashboardId = this.state.deleteDialogEntity.get("id");
    } else {
    }

    this.closeDashboardDialog();
  }

  async deleteDashboard() {
    //let dashboardId = this.state.deleteDialogEntity.get("id");
    this.closeDeleteDialog();
  }

  openDashboardDialog(mode='Add', dashboard=null) {
    this.setState({
      dashboardDialogOpen: true,
      dashboardDialogMode: mode,
      dashboardDialogEntity: dashboard,
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
      deleteDialogEntity: dashboard,
    });
  }

  closeDeleteDialog() {
    this.setState({deleteDialogOpen: false});
  }
}

export default DashboardTabBar;
