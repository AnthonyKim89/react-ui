import React, { Component } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SurveyDetails extends Component {

  render() {
    return <div className="c-survey-details">
      { this.editable ? this.renderEditable() : this.renderDetailed()}
    </div>;
  }

  renderEditable() {
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
              <td>{station.get('measured_depth')}</td>
              <td>{station.get('inclination')}</td>
              <td>{station.get('azimuth')}</td>
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

}

SurveyDetails.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  editable: ImmutablePropTypes.bool
};

export default SurveyDetails;
