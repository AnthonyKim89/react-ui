import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col } from 'react-materialize';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './StallsHistoryApp.css';

class StallsHistoryApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates))
    );
  }

  render() {
    return (
      <div className="c-pdm-stalls-history">
        <div className="gaps"></div>
        {this.data ?
          <Row>
            <Col s={12}>
              <div className="c-pdm-stalls-history-progress">
                <div className="c-pdm-stalls-history-progress-label">
                  <div className="pull-left">24 hrs ago</div>
                  <div className="pull-right">Now</div>
                </div>
                <div className="clearfix">
                  {this.renderProgress()}
                </div>
              </div>
            </Col>
          </Row> :
        <LoadingIndicator/> }
      </div>
    );
  }

  get data() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  renderProgress() {
    let pointsData = this.data.get("data");
    let itemWidth = 100 / pointsData.size - 1;
    let style = {
      marginRight: "1%",
      width: itemWidth + "%"
    };

    return pointsData.map( (t,index) => {
      return (
        <div key={index} className="overview-progress-item" style={Object.assign({}, style, this.getColorStyle(t))}>
        </div>
      );
    });

  }

  getColorStyle(point) {
    let severity = point.get("severity");
    switch (severity) {
      case 'low': return {backgroundColor: "#ff0000"};
      case 'moderate': return {backgroundColor: "#ffff00"};
      case 'high': return {backgroundColor: "#00ff00"};
      default: return {backgroundColor: "#00ff00"};
    }
  }

}

StallsHistoryApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default StallsHistoryApp;
