import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col } from 'react-materialize';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './AccuracyApp.css';

class AccuracyApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    var dataChange = (nextProps.data !== this.props.data);
    var coordinatesChange = (nextProps.coordinates !== this.props.coordinates);
    return (dataChange || coordinatesChange);
  }

  render() {
    return (
      <div className="c-di-accuracy">
        <div className="gaps"></div>
        {subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <Row>
            <Col m={6} s={12}>
              { this.renderAccuracyPlan() }
            </Col>
            <Col m={6} s={12}>
              { this.renderBackToPlan() }
            </Col>

            <Col s={12}>
              <div className="c-di-accuracy-progress">
                <div> Accuracy </div>
                <div className="c-di-accuracy-progress-label">
                  <div className="pull-left"> 24 hrs ago </div>
                  <div className="pull-right"> Now </div>
                </div>

                <div className="clearfix">
                  {this.renderAccuracyProgress()}
                </div>
              </div>
            </Col>
          </Row> :        
        <LoadingIndicator/> }
      </div>
    );
  }

  renderAccuracyPlan() {
    let accuracyData = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","accuracy"]);

    return (
      <div className="c-di-accuracy-plan">
        <p>
          Accuracy to Plan
        </p>
        <div style={Object.assign({marginLeft:"-5px"},this.getAccuracyColorStyle(accuracyData))}>
          {this.props.convert.convertValue(accuracyData.get("distance_to_plan"), 'length', 'ft').fixFloat(2)} <span>{this.props.convert.getUnitDisplay('length')}</span>
        </div>
      </div>
    );
  }

  renderBackToPlan() {
    let recommendedData = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","recommendation"]);

    return (
      <div className="c-di-back-to-plan">
        <p>Back-to-Plan Turn</p>
        <div className="recomm-upper">
          {recommendedData.get("inclination")} <span>Inc</span>
        </div>
        <div className="recomm-upper">
          {recommendedData.get("azimuth")} <span>Azi</span>
        </div>

        <div className="recomm-below">
          Left/Right plan <span>{this.props.convert.convertValue(recommendedData.get('right_left'), 'length', 'ft').fixFloat(2)}{this.props.convert.getUnitDisplay('length')}</span>
        </div>
        <div className="recomm-below">
          High/Row plan <span>{this.props.convert.convertValue(recommendedData.get('high_low'), 'length', 'ft').fixFloat(2)}{this.props.convert.getUnitDisplay('length')}</span>
        </div>
      </div>
    );
  }

  renderAccuracyProgress() {
    let pointsData = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","points"]);
    let itemWidth = 100 / pointsData.size -1;
    let style = {
      marginRight: "1%",
      width: itemWidth + "%"
    };

    return pointsData.map( (t,index) => {
      return (
        <div key={index} className="accuracy-progress-item" style={Object.assign({},style,this.getAccuracyBackColorStyle(t))}>
        </div>
      );
    });
    
  }

  getAccuracyColorStyle(accuracyData) {
    let severity = accuracyData.get("severity");    
    if (severity === "low") {
      return Object.assign({}, {color:"#ff0000"});
    }
    else if (severity === "moderate") {
     return Object.assign({}, {color:"#ffff00"});
    }
    else {
      return Object.assign({}, {color:"#00ff00"});
    }
  }

  getAccuracyBackColorStyle(accuracyData) {    
    let severity = accuracyData.get("severity");        
    if (severity === "low") {      
      return Object.assign({}, {backgroundColor:"#ff0000"});
    }
    else if (severity === "moderate") {      
      return Object.assign({}, {backgroundColor:"#ffff00"});
    }
    else {
      return Object.assign({}, {backgroundColor:"#00ff00"});
    }
  }
 
}

AccuracyApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default AccuracyApp;
