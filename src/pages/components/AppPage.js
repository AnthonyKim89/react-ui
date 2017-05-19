import React, { Component } from 'react';

import * as appRegistry from '../../apps/appRegistry';
import AddAppDialog from '../../apps/components/addApp/AddAppDialog';

import './AppPage.css';

class AppPage extends Component {
  render() {
    const appTypes = appRegistry.uiApps.get(this.props.params.category).get('appTypes');
    const appType = appTypes.get(this.props.params.name);
    const noop = () => {};
    return (
      <div className="c-app-page">
        <AddAppDialog
          appTypes={appRegistry.uiApps}
          selectedAppType={appType}
          showCancel={false}
          showSettings={false}
          onAppAdd={noop}
          onClose={noop}
          />
      </div>
    );
  }
}

export default AppPage;
