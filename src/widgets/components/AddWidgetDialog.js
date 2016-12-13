import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Set } from 'immutable';
import { Button } from 'react-bootstrap';

import './AddWidgetDialog.css';

class AddWidgetDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {expandedCategories: Set()}
  }

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
        {this.props.widgetTypes.valueSeq().map(category => {
          const categoryItem = this.renderCategoryListItem(category);
          const widgetTypes = category.get('widgetTypes').valueSeq();
          if (this.state.expandedCategories.has(category)) {
            return [categoryItem]
              .concat(widgetTypes.map(t => this.renderWidgetTypeListItem(t)));
          } else {
            return categoryItem;
          }
        })}
      </ul>
    </div>;
  }

  renderCategoryListItem(category) {
    return <li key={category.get('title')}
        className="c-add-widget-dialog__widget-type-list-item is-category">
      <button className="c-add-widget-dialog__widget-type-list-button"
              onClick={() => this.toggleCategory(category)}>
        {category.get('title')}
      </button>
    </li>
  }

  renderWidgetTypeListItem(widgetType) {
    return <li key={widgetType.constants.NAME}
        className="c-add-widget-dialog__widget-type-list-item is-widget-type">
      <button className="c-add-widget-dialog__widget-type-list-button"
              onClick={() => this.props.onWidgetAdd(widgetType)}>
        {widgetType.constants.TITLE}
      </button>
    </li>;
  }

  toggleCategory(category) {
    this.setState(state => ({
      expandedCategories: state.expandedCategories.has(category) ? 
        state.expandedCategories.delete(category) :
        state.expandedCategories.add(category)
    }));
  }

}

AddWidgetDialog.propTypes = {
  widgetTypes: ImmutablePropTypes.map.isRequired,
  onWidgetAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddWidgetDialog;