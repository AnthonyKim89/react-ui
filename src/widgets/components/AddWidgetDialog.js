import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button } from 'react-bootstrap';

import './AddWidgetDialog.css';

class AddWidgetDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {expandedCategories: {}}
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
        {this.getWidgetTypesByCategory().map(([category, types]) => {
          const categoryItem = this.renderCategoryListItem(category);
          if (this.state.expandedCategories[category]) {
            return [categoryItem].concat(types.map(t => this.renderWidgetTypeListItem(t)));
          } else {
            return categoryItem;
          }
        })}
      </ul>
    </div>;
  }

  renderCategoryListItem(category) {
    return <li key={category}
        className="c-add-widget-dialog__widget-type-list-item is-category">
      <button className="c-add-widget-dialog__widget-type-list-button"
              onClick={() => this.toggleCategory(category)}>
        {category}
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

  getWidgetTypesByCategory() {
    return this.props.widgetTypes
      .valueSeq()
      .groupBy(widgetType => widgetType.constants.CATEGORY_TITLE)
      .entrySeq();
  }

  toggleCategory(category) {
    this.setState(state => ({
      expandedCategories: {...state.expandedCategories, [category]: !state.expandedCategories[category]}
    }));
  }

}

AddWidgetDialog.propTypes = {
  widgetTypes: ImmutablePropTypes.map.isRequired,
  onWidgetAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddWidgetDialog;