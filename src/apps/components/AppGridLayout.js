import React, { Component, PropTypes } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Modal from 'react-modal';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Icon } from 'react-materialize';
import { Map } from 'immutable';
import { Platform } from 'react-native';

import AppContainer from './AppContainer';
import AddAppDialog from './addApp/AddAppDialog';
import { GRID_BREAKPOINTS, GRID_COLUMN_SIZES, GRID_ROW_HEIGHT } from '../constants';
import common from '../../common';
import subscriptions from '../../subscriptions';
import * as appRegistry from '../appRegistry';
import * as api from '../../api';
import Convert from '../../common/Convert';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './AppGridLayout.css';

// Elements matching this selector won't be used by react-grid-layout to trigger drag events
const NON_DRAGGABLE_ELEMENT_SELECTOR = 'button, a, input, .select-wrapper';

const GridLayout = WidthProvider(Responsive);

const addAppModalStyles = {
  content: {
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    borderRadius: 0,
    backgroundColor: 'rgb(51, 51, 51)',
    color: 'white',
    border: '0',
    padding: '20px'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0)'
  }
};

/**
 * Render an app set in a "grid layout" - a two-dimensional grid of user-adjustable app boxes,
 * implemented using react-grid-layout.
 */
class AppGridLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {addAppDialogOpen: false, isTouchDevice: (Platform.OS === 'android' || Platform.OS === 'ios')};
  }

  async componentDidMount() {
    const assets = await api.getAssets();
    this.setState({assets});
  }

  render() {
    return (
      <div className="c-app-grid-layout">
        <GridLayout breakpoints={GRID_BREAKPOINTS}
                    cols={GRID_COLUMN_SIZES}
                    rowHeight={GRID_ROW_HEIGHT}
                    measureBeforeMount={true}
                    isDraggable={!this.state.isTouchDevice}
                    isResizable={!this.state.isTouchDevice}
                    onResizeStop={(...args) => this.onResizeStop(...args)}
                    onDragStop={(...args) => this.onDragStop(...args)}
                    draggableCancel={NON_DRAGGABLE_ELEMENT_SELECTOR}>
          {this.renderGridApps()}
        </GridLayout>
        {this.renderMaximizedApp()}
        {!this.props.isNative &&
          <Button onClick={() => this.openAddAppDialog()} className="c-app-grid__add-app">
            <Icon>library_add</Icon> Add App
          </Button>}
        {!this.props.isNative &&
          <Modal
            isOpen={this.state.addAppDialogOpen}
            onRequestClose={() => this.closeAddAppDialog()}
            style={addAppModalStyles}
            contentLabel="Add App to Dashboard">
            <AddAppDialog
              appTypes={appRegistry.uiApps}
              commonSettingsEditors={this.props.commonSettingsEditors}
              onAppAdd={(type, settings) => this.addApp(type, settings)}
              onClose={() => this.closeAddAppDialog()} />
          </Modal>}
      </div>
    );
  }

  renderGridApps() {
    const maximizedId = this.getMaximizedAppId();
    return this.props.apps
      .filter(app => app.get('id') !== maximizedId)
      .map(app => {
        const id = app.get('id');
        const coordinates = app.get('coordinates')
          .set('isDraggable', !this.props.isNative);
        return (
          <div key={id} data-grid={coordinates.toJS()}>
            {this.renderApp(app)}
          </div>
        );
      });
  }

  renderMaximizedApp() {
    const id = this.getMaximizedAppId();
    if (id) {
      const app = this.props.apps.find(a => a.get('id') === id);
      return this.renderApp(app, true);
    } else {
      return null;
    }
  }

  renderApp(app, maximized = false) {
    const category = app.get('category');
    const name = app.get('name');
    const id = app.get('id');
    let coordinates = app.get('coordinates');
    // This an approximation of the pixel height and width of apps.
    // The actual height and width is calculated in GridItem,
    // but not possible to extract in a *performant* way.
    // The magic 10 is the default margin that react-grid-layout adds by default.
    coordinates = coordinates.merge({
      pixelHeight: coordinates.get('h') * (GRID_ROW_HEIGHT + 10),
      pixelWidth: this.props.width * coordinates.get('w') / GRID_COLUMN_SIZES.large
    });
    const size = this.getAppSize(coordinates, maximized);
    const settings = app.get('settings');
    const appType = appRegistry.uiApps.getIn([category, 'appTypes', name]);

    // A misconfigured app or appRegistry should not take down all rendering.
    // Provide a fallback when the app is missing.
    if (appType === undefined) {
      console.log(`No UI app found for ${category}:${name}.`);
      return <div />;
    }

    const appData = this.props.appData.get(id);
    const errorData = subscriptions.selectors.getSubErrors(appData, appType.constants.SUBSCRIPTIONS);
    const isEmptyData = subscriptions.selectors.isSubDataEmpty(appData, appType.constants.SUBSCRIPTIONS);
    const hasAppFooter = !!appType.AppComponentFooter;
    return <AppContainer id={id}
                         errorData={errorData}
                         isEmptyData={isEmptyData}
                         appType={appType}
                         asset={this.props.appAssets.get(id)}
                         lastDataUpdate={subscriptions.selectors.lastDataUpdate(appData)}
                         hasAppFooter={hasAppFooter}
                         isNative={this.props.isNative}
                         size={size}
                         coordinates={coordinates}
                         maximized={maximized}
                         appSettings={settings}
                         pageParams={this.getPageParams()}
                         commonSettingsEditors={this.props.commonSettingsEditors}
                         layoutEnvironment={this.props.environment}
                         availableAssets={this.state.assets}
                         location={this.props.location}
                         onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
                         onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
                         onAppRemove={() => this.props.onAppRemove(id)}
                         onAppSettingsUpdate={(settings) => this.props.onAppSettingsUpdate(id, settings)}>
      {!errorData && <appType.AppComponent
        data={appData}
        asset={this.props.appAssets.get(id)}
        {...this.getPageParams().toJS()}
        {...settings.toObject()}
        size={size}
        coordinates={coordinates}
        widthCols={coordinates.get('w')}
        convert={this.props.convert}
        onAssetModified={asset => this.props.onAssetModified(asset)}
        onSettingChange={(key, value) => this.props.onAppSettingsUpdate(id, settings.set(key, value))} />}

      {!errorData && appType.AppComponentFooter &&
        <appType.AppComponentFooter
          data={appData}
          convert={this.props.convert}
          lastDataUpdate={subscriptions.selectors.lastDataUpdate(appData)}
        />
      }
    </AppContainer>;
  }

  getPageParams() {
    return this.props.pageParams || Map();
  }

  getAppSize(gridConfig, maximized) {
    if (maximized) {
      return common.constants.Size.XLARGE;
    } else if (gridConfig.get('w') >= 5) {
      return common.constants.Size.LARGE;
    } else if (gridConfig.get('w') >= 3) {
      return common.constants.Size.MEDIUM;
    } else {
      return common.constants.Size.SMALL;
    }
  }

  getMaximizedAppId() {
    const id = this.props.location.query.maximize;
    return id && parseInt(id, 10);
  }

  onResizeStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onAppMove(parseInt(i, 10), {x, y, w, h});
  }

  onDragStop(layout, oldItem, {i, x, y, w, h}) {
    this.props.onAppMove(parseInt(i, 10), {x, y, w, h});
  }

  openAddAppDialog() {
    this.setState(() => ({addAppDialogOpen: true}));
  }

  closeAddAppDialog() {
    this.setState(() => ({addAppDialogOpen: false}));
  }

  addApp(appType, appSettings) {
    this.closeAddAppDialog();
    this.props.onAppAdd(appType, appSettings);
  }

}

// The AppGridLayout needs to know its width so that it can update coordinates
// with pixel height and width values.
AppGridLayout = WidthProvider(AppGridLayout);

AppGridLayout.propTypes = {
  apps: ImmutablePropTypes.seq.isRequired,
  appData: ImmutablePropTypes.map.isRequired,
  appAssets: ImmutablePropTypes.map.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  environment: ImmutablePropTypes.map,
  pageParams: ImmutablePropTypes.map,
  onAppSubscribe: PropTypes.func.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppMove: PropTypes.func.isRequired,
  onAppSettingsUpdate: PropTypes.func.isRequired,
  onAppAdd: PropTypes.func.isRequired,
  onAppRemove: PropTypes.func.isRequired,
  onAssetModified: PropTypes.func.isRequired,
  location: PropTypes.object,
  isNative: PropTypes.bool.isRequired
};

export default AppGridLayout;
