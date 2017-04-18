import React, { Component } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SurveyDetails extends Component {

  render() {
    return <div className="c-survey-details">
      <table>
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
              <td>{station.get('depth')}</td>
              <td>{station.get('inclination')}</td>
              <td>{station.get('azimuth')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>;
  }

}

SurveyDetails.propTypes = {
  record: ImmutablePropTypes.map.isRequired
};

export default SurveyDetails;
