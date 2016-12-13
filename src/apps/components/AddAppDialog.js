import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Glyphicon } from 'react-bootstrap';

import AppIcon from './AppIcon';

import './AddAppDialog.css';

class AddAppDialog extends Component {

  render() {
    return <div className="c-add-app-dialog">
      <div className="c-add-app-dialog__header">
        <h4 className="c-add-app-dialog__title">
          Add New App
          <div className="c-add-app-dialog__subtitle">Add a new app to the dashboard</div>
        </h4>
        <Button bsStyle="link" onClick={this.props.onClose}><Glyphicon glyph="remove" /></Button>
      </div>
      {this.props.appTypes.valueSeq().map(cat => this.renderCategory(cat))}
    </div>;
  }

  renderCategory(category) {
    const appTypes = category.get('appTypes').valueSeq();
    return <div key={category.get('title')}
                className="c-add-app-dialog__category">
      <h3 className="c-add-app-dialog__category-title">
        {category.get('title')}
        <div className="c-add-app-dialog__category-subtitle">{category.get('subtitle')}</div>
      </h3>
      <ul className="c-add-app-dialog__app-type-list">
        {appTypes.map(appType => this.renderAppType(appType))}
      </ul>
    </div>;
  }
  
  renderAppType(appType) {
    return <li key={appType.constants.NAME}
               className="c-add-app-dialog__app-type-list-item">
      <AppIcon onClick={() => this.props.onAppAdd(appType)}>
      </AppIcon>
      <div className="c-add-app-dialog__app-type-title">
        {appType.constants.TITLE}
      </div>
    </li>;
  }

}

AddAppDialog.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  onAppAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddAppDialog;