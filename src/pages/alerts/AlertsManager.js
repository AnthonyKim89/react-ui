import React, { Component } from 'react';
import { Input, Button } from 'react-materialize';
import Modal from 'react-modal';

import * as api from '../../api';
import AlertDefinition from '../components/AlertDefinition';
import LoadingIndicator from '../../common/LoadingIndicator';

import './AlertsManager.css';

class AlertsManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'Add',
      alert: null,
      editing: false
    };
    this.updateAlert = this.updateAlert.bind(this);
    this.updateAlertFilter = this.updateAlertFilter.bind(this);
    this.saveAlert = this.saveAlert.bind(this);
  }

  componentDidMount() {
    this.getAlertDefinitions();
  }

  async getAlertDefinitions() {
    var definitions = await api.getAlertDefinitions();
    definitions = definitions.toJSON();
    this.setState({alerts: definitions});
  }

  edit(mode='Add', alert=null) {
    if (mode === 'Add') {
      alert = {
        filters: [this.getSampleFilter()]
      }
    }

    this.setState({
      alert: JSON.parse(JSON.stringify(alert)),
      mode: mode,
      editing: true,
    });
  }

  addFilter() {
    var alert = this.state.alert;
    alert.filters.push(this.getSampleFilter());

    this.setState({alert: alert});
  }

  getSampleFilter() {
    return {
      data_point: 'data.point.to.measure',
      sample_interval: 300,
      sample_function: 'average',
      period: 1800,
      operator: '>=',
      threshold: 0
    };
  }

  deleteFilter(index) {
    var alert = this.state.alert;
    alert.filters.splice(index, 1);
    this.setState({alert: alert});
  }

  updateAlert(event) {
    var key = event.target.getAttribute("name");
    var alert = this.state.alert;
    alert[key] = event.target.value;
    this.setState({alert: alert})
  }

  updateAlertFilter(index, event) {
    var alert = this.state.alert;
    var filter = alert.filters[index];
    var key = event.target.getAttribute("name");
    filter[key] = event.target.value;
    this.setState({alert: alert});
  }

  async saveAlert() {
    let alert = this.state.alert;

    if (this.state.mode === 'Edit') {
      let alertId = this.state.alert["id"];
      await api.putAlertDefinition(alertId, alert);
    } else {
      await api.postAlertDefinition(alert);
    }

    this.setState({editing: false});
    this.getAlertDefinitions();
  }

  cancel() {
    this.setState({editing: false})
  }

  readyToRender() {
      return this.state.alerts;
  }

  render() {
    return (
      this.readyToRender() ?
      <div className="c-alerts-manager">
        <div className="c-alerts-manager-header">
          <h1>Alerts Manager</h1>
        </div>
        <div className="c-alert-definitions">
          {this.state.alerts && this.state.alerts.length === 0 &&
            <div className="c-alert-none">No Alerts Found</div>}

          {this.state.alerts && this.state.alerts.map((alert) => {
            return <AlertDefinition key={alert.id} alert={alert} onClick={() => this.edit('Edit', alert)}/>
          })}

          <AlertDefinition onClick={() => this.edit('Add')}/>

          <div className="clearfix"></div>
        </div>

        <Modal
          isOpen={this.state.editing}
          onRequestClose={() => this.closeDialog()}
          className='c-alert-editor'
          overlayClassName='c-alert-editor-overlay'
          contentLabel={this.state.mode + " Alert"}>
          <div className="c-alert-dialog">
            <header>
              <h4 className="c-alert-dialog-title">
                {this.state.mode + " Alert"}
              </h4>
            </header>
            <div className="c-alert-dialog-alert-editor">
              <Input label="Name" name="name"
                     defaultValue={this.state.alert && this.state.alert['name']} onChange={this.updateAlert} />
              <Input label="Description"
                     defaultValue={this.state.alert && this.state.alert['description']} />
              <Input type='select' label="Level" defaultValue={this.state.alert ? this.state.alert['level'] : 'INFO'}>
                <option value='INFO'>Info</option>
                <option value='WARNING'>Warning</option>
                <option value='ERROR'>Error</option>
              </Input>
              <Input type='select' label="Filter Logic" defaultValue={this.state.alert ? this.state.alert['filter_logic'] : 'AND'}>
                <option value='AND'>AND</option>
                <option value='OR'>OR</option>
              </Input>
            </div>
            <div className="c-alert-dialog-filters">
              <h4 className="c-alert-dialog-filters-header">Filters</h4>
              {this.state.alert && this.state.alert.filters && this.state.alert.filters.map((filter, index) => (
                <div key={index} className="c-alert-dialog-filter">
                  <Button floating icon="delete" className="c-alert-delete-filter red" onClick={() => this.deleteFilter(index)}></Button>
                  Measure
                  <Input type='select' name="sample_function" defaultValue={filter.sample_function} className="c-alert-dialog-filter-sample-function" onChange={this.updateAlertFilter.bind(this, index)}>
                    <option value='average'>Average</option>
                    <option value='median'>Median</option>
                    <option value='count'>Count</option>
                    <option value='minimum'>Minimum</option>
                    <option value='maximum'>Maximum</option>
                  </Input>
                  <Input defaultValue={filter.data_point} name="data_point" className="c-alert-dialog-filter-data-point" onChange={this.updateAlertFilter.bind(this, index)} />
                  <br />
                  every <Input defaultValue={filter.sample_interval} name="sample_interval" className="c-alert-dialog-filter-sample-interval" onChange={this.updateAlertFilter.bind(this, index)} /> seconds
                  for <Input defaultValue={filter.period} name="period" className="c-alert-dialog-filter-period" onChange={this.updateAlertFilter.bind(this, index)} /> seconds
                  <br />
                  and check if
                  <Input type='select' defaultValue={filter.operator} name="operator" className="c-alert-dialog-filter-operator" onChange={this.updateAlertFilter.bind(this, index)}>
                    <option value='='>=</option>
                    <option value='!='>!=</option>
                    <option value='>'>&gt;</option>
                    <option value='>='>&gt;=</option>
                    <option value='<'>&lt;</option>
                    <option value='<='>&lt;=</option>
                  </Input> <Input defaultValue={filter.threshold} name="threshold" className="c-alert-dialog-filter-threshold" onChange={this.updateAlertFilter.bind(this, index)} />
                </div>
              ))}
              <Button className="c-alert-add-filter btn-small" onClick={() => this.addFilter()}>Add Filter</Button>
            </div>
            <div className="c-alert-dialog-actions">
              <Button className="c-alert-save" onClick={() => this.saveAlert()}>Save</Button>
              <Button className="c-alert-cancel" onClick={() => this.cancel()}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </div>:
      <LoadingIndicator />
    );
  }

}

export default AlertsManager;
