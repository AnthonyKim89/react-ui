import React, { Component, PropTypes } from 'react';
import { isEqual } from 'lodash';
import { Row, Col, Button, Icon, Input } from 'react-materialize';
import Modal from 'react-modal';

import './TracesSettingsBar.css';

class TracesSettingsBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayDialogOpen: false,
    };
    this.saveDisplaySettings = this.saveDisplaySettings.bind(this);
  }

  render() {
    return <div className="c-traces__settings-bar">
      <div className="c-traces__settings-bar__setting" onClick={() => this.openDisplaySettingsDialog()}>
        <div className="c-traces__settings-bar__setting__icon"><Icon>assessment</Icon></div>
        <div className="c-traces__settings-bar__setting__label">Display</div>
      </div>

      <Modal
        width='400px'
        isOpen={this.state.displayDialogOpen}
        onRequestClose={() => this.closeDialogs()}
        className="c-traces__settings-bar__display-settings"
        overlayClassName='c-traces__settings-bar__display-settings__overlay'
        contentLabel="Traces Display Settings">
        {this.state.displayDialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__settings-bar__display-settings__dialog">
          <header>
            <h4 className="c-traces__settings-bar__display-settings__dialog__title">
              Display Settings
            </h4>
          </header>

          <Input
            type="select"
            label="Columns"
            defaultValue={this.props.traceColumnCount !== undefined ? this.props.traceColumnCount : 4}
            ref={(input) => this.traceColumnCountInput = input}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </Input>

          <Input
            type="select"
            label="Rows"
            defaultValue={this.props.traceRowCount !== undefined ? this.props.traceRowCount : 3}
            ref={(input) => this.traceRowCountInput = input}>
            <option value="0">Hide</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Input>

          <Row className="c-traces__settings-bar__display-settings__dialog__button-row">
            <Col s={6}>
              <Button className="c-traces__settings-bar__display-settings__dialog__done" onClick={() => this.saveDisplaySettings()}>
                Save
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-traces__settings-bar__display-settings__dialog__cancel" onClick={() => this.closeDialogs()}>
                Cancel
              </Button>
            </Col>
          </Row>

        </div>}
      </Modal>
    </div>;
  }

  async saveDisplaySettings() {
    let traceColumnCount = parseInt(this.traceColumnCountInput.state.value, 10);
    let traceRowCount = parseInt(this.traceRowCountInput.state.value, 10);

    await this.props.onSettingChange("traceColumnCount", 0); // We have to clear this first and then reset it to fix highcharts issues
    await this.props.onSettingChange("traceRowCount", traceRowCount);
    await this.props.onSettingChange("traceColumnCount", traceColumnCount);

    this.closeDialogs();
  }

  openDisplaySettingsDialog() {
    this.setState({
      displayDialogOpen: true,
    });
  }

  closeDialogs() {
    this.setState({
      displayDialogOpen: false,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state)
      || this.props.traceColumnCount !== nextProps.traceColumnCount
      || this.props.traceRowCount !== nextProps.traceRowCount;
  }
}

TracesSettingsBar.propTypes = {
  traceColumnCount: PropTypes.number,
  traceRowCount: PropTypes.number,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesSettingsBar;
