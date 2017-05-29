import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Convert from '../../../common/Convert';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './DrillstringComponentBrowser.css';
class DrillstringComponentBrowser extends Component {

  render() {    

    return <div className="c-settings-record-browser">      
      
      </div>
    };
  }
}

DrillstringComponentBrowser.propTypes = {
  recordNamePlural: PropTypes.string.isRequired,
  recordNameSingular: PropTypes.string.isRequired,
  RecordSummary: PropTypes.func.isRequired,
  RecordDetails: PropTypes.func.isRequired,
  renderRecordListItem: PropTypes.func.isRequired,
  records: ImmutablePropTypes.list.isRequired,
  displayingRecord: ImmutablePropTypes.map,
  onSelectRecord: PropTypes.func.isRequired,
  onNewRecord: PropTypes.func.isRequired,
  onEditRecord: PropTypes.func.isRequired,
  onDeleteRecord: PropTypes.func.isRequired,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
};

export default DrillstringComponentBrowser;