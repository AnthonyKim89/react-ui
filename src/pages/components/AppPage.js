import React, { Component } from 'react';

import * as appRegistry from '../../apps/appRegistry';
import AddAppDialog from '../../apps/components/addApp/AddAppDialog';

import './AppPage.css';

class AppPage extends Component {
  render() {
    let appType = null;
    if (this.props.params.category) {
      const appTypes = appRegistry.uiApps.get(this.props.params.category).get('appTypes');
      appType = appTypes.get(this.props.params.name);
    }
    // TODO: Update location from /apps page selection.
    // TODO: Figure out what to do with the handlers.
    const noop = () => {};
    return (
      <div className="c-app-page">
        <AddAppDialog
          appTypes={appRegistry.uiApps}
          selectedAppType={appType}
          onAppAdd={noop}
          onClose={noop}
          />
      </div>
    );
  }
}

export default AppPage;
