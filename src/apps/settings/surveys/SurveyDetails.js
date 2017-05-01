import React, { Component, PropTypes } from 'react';
import { Input, Button } from 'react-materialize';
import { List, Map } from 'immutable';
import numeral from 'numeral';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './SurveyDetails.css';

class SurveyDetails extends Component {

  render() {
    return <div className="c-survey-details">
      { this.props.isEditable ? this.renderEditable() : this.renderDetailed()}
    </div>;
  }

  renderEditable() {
    console.log(this.props.record.toJS());
    return <div className="c-survey-details__edit-table">
      <table>
        <thead>
          <tr>
            <th>Measured Depth</th>
            <th>Inclination</th>
            <th>Azimuth</th>
          </tr>
        </thead>
        <tbody>
          {this.props.record.getIn(['data', 'stations'], List()).map((station, index) => 
            <tr key={index}>
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
    return <table>
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
              <td>{numeral(station.get('azimuth')).format('0,0.00')}{station.get('azimuth')}</td>
              <td>{numeral(station.get('tvd')).format('0,0.00')}</td>
              <td>{numeral(station.get('vertical_section')).format('0,0.00')}</td>
              <td>{numeral(station.get('northing')).format('0,0.00')}</td>
              <td>{numeral(station.get('easting')).format('0,0.00')}</td>
              <td>{numeral(station.get('dls')).format('0,0.00')}</td>
            </tr>
          )}
        </tbody>
      </table>;
  }

  onAddSurveyItem() {
    const item = Map({
      measured_depth: '',
      inclination: '',
      azimuth:''  
    });

    let record = this.props.record;
    console.log(record.toJS());
    if (!record.getIn(['data','stations'])) {
      record = this.props.record.update('data', old => old.set('stations', List()));
    }
    this.props.onUpdateRecord(record.updateIn(['data', 'stations'], c => c.push(item)));
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
