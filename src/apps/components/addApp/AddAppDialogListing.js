import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Col, ControlLabel, Form, Grid, FormControl, FormGroup, Row } from 'react-bootstrap';

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
        <Form horizontal className="c-add-app-dialog-listing__controls"> 
          <FormGroup controlId="formControlsSelect">
            <Col componentClass={ControlLabel} sm={1}>
              Category
            </Col>
            <Col sm={2}>
              <FormControl componentClass="select"
                           onChange={e => this.setState({category: e.target.value})}>
                <option value="all">All</option>
                {this.props.appTypes.valueSeq().map(cat =>
                  <option key={cat.get('title')}>{cat.get('title')}</option>)}
              </FormControl>
            </Col>
            <Col componentClass={ControlLabel} sm={1}>
              Filter
            </Col>
            <Col sm={4}>
              <FormControl
                componentClass="input"
                type="text"
                placeholder="Enter Text..."
                onChange={e => this.setState({filter: e.target.value})}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
      <Grid fluid>
        {this.getCategories().map(cat => this.renderCategory(cat))}
      </Grid>
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
      return <Row key={category.get('title')}
                  className="c-add-app-dialog-listing__category">
        
        <Col sm={2} className="c-add-app-dialog-listing__category-title">
          <h3>{category.get('title')}</h3>
          <div className="c-add-app-dialog-listing__category-subtitle">{category.get('subtitle')}</div>
        </Col>
        <Col sm={10} className="c-add-app-dialog-listing__app-type-list">
          {appTypes.map(appType => this.renderAppType(appType))}
        </Col>
      </Row>;
    }
  }
  
  renderAppType(appType) {
    return <div key={appType.constants.NAME}
               className="c-add-app-dialog-listing__app-type-list-item">
      <AppIcon onClick={() => this.props.onSelectType(appType)}>
      </AppIcon>
      <div className="c-add-app-dialog-listing__app-type-title">
        {appType.constants.METADATA.settingsTitle}
      </div>
      <a className="c-add-app-dialog-listing__app-type-developer-link"
         href={appType.constants.METADATA.developer.url}
         target="_blank">
        {appType.constants.METADATA.developer.name}
      </a>
    </div>;
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