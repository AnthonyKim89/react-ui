import React, {Component, PropTypes} from 'react';
import { Button, Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import AppIcon from './AppIcon';

import './AddAppDialogDetails.css';

class AddAppDialogDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {settings: Map()};
  }

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
      <span className="c-add-app-dialog-details__breadcrumbs-app-type">{this.props.appType.constants.METADATA.settingsTitle}</span>
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
        <h4>Add App</h4>
      </Col>
      <Col xs={12} sm={5} lg={4}>
        {this.getSettingsEditors().map(editor => {
          const name = editor.get('name');
          const title = editor.get('title');
          const Editor = editor.get('Editor');
          return <div className="c-add-app-dialog-details__setting" key={name}>
            <h5>{title}</h5>
            <Editor
              currentValue={this.state.settings.get(name)}
              onChange={v => this.setState({settings: this.state.settings.set(name, v)})}
              appType={this.props.appType} />
          </div>;
        })}
        <Button bsStyle="primary"
                onClick={() => this.props.onAppAdd(this.props.appType, this.state.settings)}
                disabled={!this.isAllRequiredSettingsFilled()}>
          Add
        </Button>
      </Col>
    </Row>;
  }

  getSettingsEditors() {
    const forAppType = this.props.appType.settingsEditors || List();
    const common = this.props.commonSettingsEditors || List();
    return forAppType.concat(common).filter(ed => ed.get('required'));
  }

  isAllRequiredSettingsFilled() {
    const requiredNames = this.getSettingsEditors().map(ed => ed.get('name'));
    return requiredNames.every(name => this.state.settings.get(name));
  }

}

AddAppDialogDetails.propTypes = {
  appType: PropTypes.object.isRequired,
  commonSettingsEditors: ImmutablePropTypes.list,
  appTypeCategory: PropTypes.string.isRequired,
  onAppAdd: PropTypes.func.isRequired
};

export default AddAppDialogDetails;