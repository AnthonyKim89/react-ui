import React, { Component, PropTypes } from 'react';
import { Input } from 'react-materialize';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SurveyDetails extends Component {

  render() {
    return <div className="c-survey-details">
      { this.props.isEditable ? this.renderEditable() : this.renderDetailed()}
    </div>;
  }

  renderEditable() {
    console.log(this.props.record.toJS());
    return <table>
        <thead>
          <tr>
            <th>M. Depth</th>
            <th>Inc</th>
            <th>Azi</th>
          </tr>
        </thead>
        <tbody>
          {this.props.record.getIn(['data', 'stations'], List()).map((station, index) => 
            <tr key={index}>
              <td>
                <Input type="number" 
                  s={12}
                  label="M.Depth"
                  defaultValue={station.get('measured_depth')}
                  onChange={e => this.onValueChange(index,'measured_depth', e.target.value,true)}
                />
              </td>

              <td>
                <Input type="number" 
                  s={12}
                  label="M.Depth"
                  defaultValue={station.get('inclination')}
                  onChange={e => this.onValueChange(index,'inclination', e.target.value,true)}
                />              
              </td>
              <td>
                <Input type="number" 
                  s={12}
                  label="M.Depth"
                  defaultValue={station.get('azimuth')}
                  onChange={e => this.onValueChange(index,'azimuth', e.target.value,true)}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>;
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
              <td>{station.get('measured_depth')}</td>
              <td>{station.get('inclination')}</td>
              <td>{station.get('azimuth')}</td>
              <td>{station.get('tvd')}</td>
              <td>{station.get('vertical_section')}</td>
              <td>{station.get('northing')}</td>
              <td>{station.get('easting')}</td>
              <td>{station.get('dls')}</td>
            </tr>
          )}
        </tbody>
      </table>;
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
