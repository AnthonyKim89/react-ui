import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './AddWidgetDialog.css';

class AddWidgetDialog extends Component {

  render() {
    return <div className="c-add-widget-dialog">
      <h2>Add Widget to Dashboard</h2>
      <ul className="c-add-widget-dialog__widget-type-list">
        {this.props.widgetTypes.valueSeq().map(widgetType =>
          <li key={widgetType.constants.NAME}
              className="c-add-widget-dialog__widget-type-list-item">
            <button className="c-add-widget-dialog__add-widget-button"
                    onClick={() => this.props.onWidgetAdd(widgetType)}>
              {widgetType.constants.TITLE}
            </button>
          </li>
        )}
      </ul>
    </div>;
  }

}

AddWidgetDialog.propTypes = {
  widgetTypes: ImmutablePropTypes.map.isRequired,
  onWidgetAdd: PropTypes.func.isRequired
};

export default AddWidgetDialog;