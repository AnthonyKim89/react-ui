import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-modal';
import NotificationSystem from 'react-notification-system';
import ImmutablePropTypes from 'react-immutable-proptypes';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ActionSettings from 'material-ui/svg-icons/action/settings';

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
    return (
      <div>
        <ul className="c-dashboard-tab-bar">
          {this.props.dashboards.map(dashboard =>
            <li key={dashboard.get('id')}>
              <Link to={`/dashboards/${dashboard.get('slug')}`} className="c-dashboard-tab-bar__dashboard-link" activeClassName="is-active">
                {dashboard.get('name')}
              </Link>
            </li>)}
          <li>
            <FlatButton className="c-dashboard-tab-bar__add-dashboard" icon={<ContentAddCircleOutline />}
              style={{height: '100%', minWidth: '50px'}}
              onClick={() => this.openDashboardDialog()} />
          </li>
          <li className="c-dashboard-tab-bar__settings-menu">
            <IconMenu
              iconButtonElement={<IconButton><ActionSettings /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Edit" onClick={() => this.openDashboardDialog('Edit')} />
              <MenuItem primaryText="Delete" onClick={() => this.openDeleteDialog()} />
              <MenuItem primaryText="Sort" onClick={() => this.openSortDialog()} />
            </IconMenu>
          </li>
        </ul>
        <Modal
          isOpen={this.state.dashboardDialogOpen}
          onRequestClose={() => this.closeDashboardDialog()}
          className='c-dashboard-tab-bar__edit-dashboard'
          overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
          contentLabel={this.state.dashboardDialogMode.toUpperCase() + " Dashboard"}>
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
              <header>
                <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
                  {this.state.dashboardDialogMode + " Dashboard"}
                </h4>
              </header>
              <TextField type="text" 
                ref={(input) => this.dashboardNameInput = input}
                floatingLabelText="Dashboard Name"
                fullWidth={true}
                defaultValue={this.props.currentDashboard && this.state.dashboardDialogMode === 'Edit' ? this.props.currentDashboard.get('name') : ""} />
              <RaisedButton label="Save" primary={true} onClick={() => this.saveDashboard()} />
            </div>
          </MuiThemeProvider>
        </Modal>
        <Modal
          isOpen={this.state.sortDialogOpen}
          onRequestClose={() => this.closeSortDialog()}
          className='c-dashboard-tab-bar__edit-dashboard'
          overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
          contentLabel="Sort Dashboards">
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
              <header>
                <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
                  Sort Dashboards
                </h4>
              </header>
              <SortableComponent ref={(input) => this.dashboardList = input} items={this.props.dashboards} />
              <RaisedButton label="Save" primary={true} onClick={() => this.saveOrdering()} />
            </div>
          </MuiThemeProvider>
        </Modal>
        <Modal
          isOpen={this.state.deleteDialogOpen}
          onRequestClose={() => this.closeDeleteDialog()}
          className='c-dashboard-tab-bar__edit-dashboard'
          overlayClassName='c-dashboard-tab-bar__edit-dashboard__overlay'
          contentLabel="Delete Dashboard?">
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <div className="c-dashboard-tab-bar__edit-dashboard__dialog">
              <header>
                <h4 className="c-dashboard-tab-bar__edit-dashboard__dialog__title">
                  Delete Dashboard?
                </h4>
              </header>
              <h5>Do you wish to delete this dashboard?</h5>
              <h5>Name: <span className="c-dashboard-tab-bar__edit-dashboard__bold">{this.props.currentDashboard && this.props.currentDashboard.get("name")}</span></h5>
              <div className="c-dashboard-tab-bar__edit-dashboard__dialog__button-row">
                <div className="c-dashboard-tab-bar__edit-dashboard__dialog__button-col">
                  <RaisedButton label="Delete" fullWidth={true} primary={true} onClick={() => this.deleteDashboard()} />
                </div>
                <div className="c-dashboard-tab-bar__edit-dashboard__dialog__button-col">
                  <RaisedButton label="Cancel" fullWidth={true} onClick={() => this.closeDeleteDialog()} className="c-dashboard-tab-bar__edit-dashboard__dialog__cancel" />
                </div>
                <div className="clear-float" />
              </div>
            </div>
          </MuiThemeProvider>
        </Modal>
        <NotificationSystem ref="notificationSystem" noAnimation={true} />
      </div>
    );
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
