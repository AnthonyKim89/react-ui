import React, {Component, PropTypes} from 'react';
import { Button, Glyphicon, Grid, Row, Col } from 'react-bootstrap';

import AppIcon from './AppIcon';

import './AddAppDialogDetails.css';

class AddAppDialogDetails extends Component {

  render() {
    return <div className="c-add-app-dialog-details">
      {this.renderBreadcrumbs()}
      <Grid fluid>
        {this.renderAppDetails()}
        {this.renderAppActions()}
      </Grid>
    </div>;
  }

  renderBreadcrumbs() {
    return <h4 className="c-add-app-dialog-details__breadcrumbs">
      <span>Apps</span>
      <Glyphicon glyph="chevron-right" className="c-add-app-dialog-details__breadcrumbs-divider" />
      <span>{this.props.appTypeCategory}</span>
      <Glyphicon glyph="chevron-right" className="c-add-app-dialog-details__breadcrumbs-divider" />
      <span className="c-add-app-dialog-details__breadcrumbs-app-type">{this.props.appType.constants.METADATA.title}</span>
    </h4>;
  }

  renderAppDetails() {
    const {
      title,
      subtitle,
      developer: {name: devName, url: devUrl},
      version,
      publishedAt
    } = this.props.appType.constants.METADATA;
    return <Row className="c-add-app-dialog-details__section">
      <Col xs={12} sm={3} lg={2}>
        <AppIcon />
      </Col>
      <Col xs={12} sm={9} lg={10}>
        <table className="c-add-app-dialog-details__metadata">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{subtitle}</td>
            </tr>
            <tr>
              <th>Developer</th>
              <td><a href={devUrl} target="_blank">{devName}</a></td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{version}</td>
            </tr>
            <tr>
              <th>Published</th>
              <td>{publishedAt}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  }

  renderAppActions() {
    return <Row className="c-add-app-dialog-details__section">
      <Col xs={12} sm={3} lg={2}>
        <h4>Actions</h4>
      </Col>
      <Col xs={12} sm={9} lg={10}>
        <Button bsStyle="primary" onClick={() => this.props.onAppAdd(this.props.appType)}>
          Add
        </Button>
      </Col>
    </Row>;
  }

}

AddAppDialogDetails.propTypes = {
  appType: PropTypes.object.isRequired,
  appTypeCategory: PropTypes.string.isRequired,
  onAppAdd: PropTypes.func.isRequired
};

export default AddAppDialogDetails;