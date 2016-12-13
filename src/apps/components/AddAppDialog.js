import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Set } from 'immutable';
import { Button } from 'react-bootstrap';

import './AddAppDialog.css';

class AddAppDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {expandedCategories: Set()}
  }

  render() {
    return <div className="c-add-app-dialog">
      <Button className="c-add-app-dialog__cancel-button"
              onClick={this.props.onClose}>
        Cancel
      </Button>
      <h3>
        Add App to Dashboard
      </h3>
      <ul className="c-add-app-dialog__app-type-list">
        {this.props.appTypes.valueSeq().map(category => {
          const categoryItem = this.renderCategoryListItem(category);
          const appTypes = category.get('appTypes').valueSeq();
          if (this.state.expandedCategories.has(category)) {
            return [categoryItem]
              .concat(appTypes.map(t => this.renderAppTypeListItem(t)));
          } else {
            return categoryItem;
          }
        })}
      </ul>
    </div>;
  }

  renderCategoryListItem(category) {
    return <li key={category.get('title')}
        className="c-add-app-dialog__app-type-list-item is-category">
      <button className="c-add-app-dialog__app-type-list-button"
              onClick={() => this.toggleCategory(category)}>
        {category.get('title')}
      </button>
    </li>
  }

  renderAppTypeListItem(appType) {
    return <li key={appType.constants.NAME}
        className="c-add-app-dialog__app-type-list-item is-app-type">
      <button className="c-add-app-dialog__app-type-list-button"
              onClick={() => this.props.onAppAdd(appType)}>
        {appType.constants.TITLE}
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

AddAppDialog.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  onAppAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddAppDialog;