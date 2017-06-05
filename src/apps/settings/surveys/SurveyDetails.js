import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-materialize';
import { List, Map } from 'immutable';
import numeral from 'numeral';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV1 from 'uuid/v1';

import './SurveyDetails.css';

class SurveyDetails extends Component {

  render() {
    return <div className="c-survey-details">
      { this.props.isEditable ? this.renderEditable() : this.renderDetailed()}
    </div>;
  }

  renderEditable() {
    return <div className="c-survey-details__edit-table">
      <table>
        <thead>
          <tr>
            <th>Measured Depth</th>
            <th>Inclination</th>
            <th>Azimuth</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.record.getIn(['data', 'stations'], List()).map((station, index) => 
            <tr key={uuidV1()}>
              <td>
                <Input type="number" 
                  s={12}
                  label="Measured Depth"
                  defaultValue={numeral(station.get('measured_depth')).format('0.0')}
                  onChange={e => this.onValueChange(index,'measured_depth', e.target.value,true)}
                />
              </td>

              <td>
                <Input type="number" 
                  s={12}
                  label="Inclination"
                  defaultValue={numeral(station.get('inclination')).format('0.0')}
                  onChange={e => this.onValueChange(index,'inclination', e.target.value,true)}
                />              
              </td>
              <td>
                <Input type="number" 
                  s={12}
                  label="Azimuth"
                  defaultValue={numeral(station.get('azimuth')).format('0.0')}
                  onChange={e => this.onValueChange(index,'azimuth', e.target.value,true)}
                />
              </td>
              <td>
                <Button floating icon="delete" className="red" onClick={() => this.onDeleteSurveyItem(index)}></Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        <Button floating icon="add" onClick={() => this.onAddSurveyItem()}></Button>
      </div>  
    </div>;
  }

  renderDetailed() {
    return <div className="c-survey-details__detail-table">
      <table>
        <thead>
          <tr>
            <th>M. Depth</th>
            <th>Inc</th>
            <th>Azi</th>
            <th>TVD</th>
            <th>VS</th>
            <th>N/S</th>
            <th>E/W</th>
            <th>DLS</th>
          </tr>
        </thead>
        <tbody>
          {this.props.record.getIn(['data', 'stations'], List()).map((station, index) => 
            <tr key={index}>
              <td>{numeral(station.get('measured_depth')).format('0,0.00')}</td>
              <td>{numeral(station.get('inclination')).format('0,0.00')}</td>
              <td>{numeral(station.get('azimuth')).format('0,0.00')}</td>
              <td>{numeral(station.get('tvd')).format('0,0.00')}</td>
              <td>{numeral(station.get('vertical_section')).format('0,0.00')}</td>
              <td>{numeral(station.get('northing')).format('0,0.00')}</td>
              <td>{numeral(station.get('easting')).format('0,0.00')}</td>
              <td>{numeral(station.get('dls')).format('0,0.00')}</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="c-survey-details__actions">
        <Button floating icon="edit" onClick={() => this.props.onEditRecord()}></Button>
        <Button floating icon="delete" className="red" onClick={() => this.props.onDeleteRecord()}></Button>
      </div>
    </div>;
  }

  onAddSurveyItem() {
    const item = Map({
      measured_depth: '',
      inclination: '',
      azimuth:''  
    });

    let record = this.props.record;
    if (!record.getIn(['data','stations'])) {
      record = this.props.record.update('data', old => old.set('stations', List()));
    }
    this.props.onUpdateRecord(record.updateIn(['data', 'stations'], c => c.push(item)));
  }

  onDeleteSurveyItem(index) {     
    
    let a= this.props.record.deleteIn(['data', 'stations', index]);    
    this.props.onUpdateRecord(a);
    
  }

  onValueChange(idx,name, value,isNumber) {
    if (isNumber) {
      value = isNaN(parseFloat(value))? value: parseFloat(value);
    }
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'stations', idx, name], value));
  }

}

SurveyDetails.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default SurveyDetails;
