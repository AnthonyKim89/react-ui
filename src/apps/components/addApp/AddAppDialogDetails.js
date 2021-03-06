import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import { Button, Icon, Row, Col } from 'react-materialize';
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
      <AppIcon title={this.props.appType.constants.METADATA.title || this.props.appType.constants.METADATA.settingsTitle}/>
      {this.renderAppDetails()}
      {this.props.showSettings &&
        <div>
          <h4>Settings</h4>
          {this.renderAppActions()}
          <Button onClick={() => this.props.onAppAdd(this.props.appType, this.state.settings)} disabled={!this.isAllRequiredSettingsFilled()}>
            Add
          </Button>
        </div>
      }
    </div>;
  }

  renderBreadcrumbs() {
    return <h4 className="c-add-app-dialog-details__breadcrumbs">
      <Button className="c-add-app-dialog-details__breadcrumbs-apps" onClick={this.props.onViewAllApps}>Apps</Button>
      <Icon className="c-add-app-dialog-details__breadcrumbs-divider">keyboard_arrow_right</Icon>
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
    return <div className="c-add-app-dialog-details__section">
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Name
        </Col>
        <Col>
          {title}
        </Col>
      </Row>
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Category
        </Col>
        <Col>
          {this.props.appTypeCategory}
        </Col>
      </Row>
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Description
        </Col>
        <Col>
          {subtitle}
        </Col>
      </Row>
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Developer
        </Col>
        <Col>
          <a href={devUrl} target="_blank">{devName}</a>
        </Col>
      </Row>
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Version
        </Col>
        <Col>
          {version}
        </Col>
      </Row>
      <Row className="c-add-app-dialog-details__metadata">
        <Col s={1} className="c-add-app-dialog-details__metadata__title">
          Published
        </Col>
        <Col>
          {moment(publishedAt).format("MMM Do YYYY")}
        </Col>
      </Row>
    </div>;
  }

  renderAppActions() {
    return <Row className="c-add-app-dialog-details__section">
      <Col s={2}>
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
      </Col>
    </Row>;
  }

  getSettingsEditors() {
    const forAppType = this.props.appType.settings || List();
    let common = this.props.commonSettingsEditors || List();
    if (this.props.appType.constants.METADATA.multiRig) {
      common = common.filter(x => x.get('name') !== 'assetId');
    }
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
  onAppAdd: PropTypes.func.isRequired,
  onViewAllApps: PropTypes.func.isRequired,
  showSettings: PropTypes.bool
};

AddAppDialogDetails.defaultProps = {
  showSettings: true
};

export default AddAppDialogDetails;
