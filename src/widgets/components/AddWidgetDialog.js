import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button } from 'react-bootstrap';

import './AddWidgetDialog.css';

class AddWidgetDialog extends Component {

  render() {
    return <div className="c-add-widget-dialog">
      <Button className="c-add-widget-dialog__cancel-button"
              onClick={this.props.onClose}>
        Cancel
      </Button>
      <h3>
        Add Widget to Dashboard
      </h3>
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
  onWidgetAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddWidgetDialog;