import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col, Input, Icon } from 'react-materialize';

import AppIcon from './AppIcon';

import './AddAppDialogListing.css';

class AddAppDialogListing extends Component {

  constructor(props) {
    super(props);
    this.state = {category: 'all'};
  }

  render() {
    return <div className="c-add-app-dialog-listing">
      <div className="c-add-app-dialog-listing__header">
        <h4 className="c-add-app-dialog-listing__title">
          Add New App
          <div className="c-add-app-dialog-listing__subtitle">Add a new app to the dashboard</div>
        </h4>
        <Row className="c-add-app-dialog-listing__controls">
          <Col s={2}>
            <Input type='select' label="Category" defaultValue='0' onChange={e => this.setState({category: e.target.value})}>
              <option value="all">All</option>
              {this.props.appTypes.valueSeq().map(cat =>
                <option key={cat.get('title')}>{cat.get('title')}</option>)}
            </Input>
          </Col>
          <Col s={8}>
            <Input s={6} label="Filter" onChange={e => this.setState({filter: e.target.value})}><Icon>search</Icon></Input>
          </Col>
        </Row>
      </div>
      <div>
        {this.getCategories().map(cat => this.renderCategory(cat))}
      </div>
    </div>;
  }

  getCategories() {
    return this.props.appTypes
      .valueSeq()
      .filter(cat => this.state.category === 'all' || this.state.category === cat.get('title'));
  }

  renderCategory(category) {
    const appTypes = category.get('appTypes')
      .valueSeq()
      .filter(appType => !appType.constants.METADATA.isHiddenFromAddApp)
      .filter(appType => this.isAppTypeIncludedInFilter(appType));
    if (!appTypes.isEmpty()) {
      return <div key={category.get('title')}>
        <h3 className="c-add-app-dialog-listing__category-title">{category.get('title')}</h3>
        <h4 className="c-add-app-dialog-listing__category-subtitle">{category.get('subtitle')}</h4>
        <Row key={category.get('title')} className="c-add-app-dialog-listing__category">
          <div className="c-add-app-dialog-listing__app-type-list">
            {appTypes.map(appType => this.renderAppType(appType))}
          </div>
        </Row>
      </div>;
    }
  }
  
  renderAppType(appType) {
    return <Col s={1} key={appType.constants.NAME} className="c-add-app-dialog-listing__app-type-list-item">
      <AppIcon onClick={() => this.props.onSelectType(appType)} title={appType.constants.METADATA.title}>
      </AppIcon>
      <div className="c-add-app-dialog-listing__app-type-title">
        {appType.constants.METADATA.settingsTitle}
      </div>
      <a className="c-add-app-dialog-listing__app-type-developer-link"
         href={appType.constants.METADATA.developer.url}
         target="_blank">
        {appType.constants.METADATA.developer.name}
      </a>
    </Col>;
  }

  isAppTypeIncludedInFilter(appType) {
    const filter = (this.state.filter || '').toLowerCase();
    return appType.constants.METADATA.settingsTitle.toLowerCase().indexOf(filter) >= 0;
  }

}

AddAppDialogListing.propTypes = {
  appTypes: ImmutablePropTypes.map.isRequired,
  onSelectType: PropTypes.func.isRequired
};

export default AddAppDialogListing;