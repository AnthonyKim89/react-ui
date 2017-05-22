import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List } from 'immutable';

import * as api from '../../../api';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import { METADATA, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './WellPlanApp.css';

class WellPlanApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actualData: null,
      planData: null
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.getData();      
    }
  }

  componentWillReceiveProps(nextProps) {
    if ( (!this.props.asset && nextProps.asset) || (this.props.asset && nextProps.asset && (this.props.asset.get("id") !== nextProps.asset.get("id")))) {
      this.getData(nextProps.asset);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  (
              this.state.actualData !== nextState.actualData ||
              this.state.planData !== nextState.planData ||
              this.props.graphType !== nextProps.graphType ||
              nextProps.autoZoom !== this.props.autoZoom ||
              !nextProps.coordinates.equals(this.props.coordinates) ||
              nextProps.graphColors !== this.props.graphColors
            );
  }

  render() {
    return (
      <div className="c-di-wellplan">
        {this.state.actualData && this.state.planData ?
          <Chart
            key={new Date().getTime()}
            horizontal={true}
            xField={ (this.getGraphType()===1) ? "vertical_section": "easting"}
            size={this.props.size}
            coordinates={this.props.coordinates}
            widthCols={this.props.widthCols}
            automaticOrientation={false}
            forceLegend={true}
            gridLineWidth="1"
            xAxisWidth={2}
            xAxisColor="#fff"
            yAxisWidth={2}
            yAxisColor="#fff"
            xMinValue={this.props.autoZoom? this.getLastActualPoint().get((this.getGraphType()===1)? "vertical_section": "easting")-1000 : null}
            xMaxValue={this.props.autoZoom? this.getLastActualPoint().get((this.getGraphType()===1)? "vertical_section": "easting")+1000: null}
            xAxisTitle={{
              text: (this.getGraphType()===1) ? "Vertical Section": "Easting",
              style: {
                color: "#fff"
              }
            }}
            yAxisTitle={{
              text: (this.getGraphType()===1) ? "True Vertical Depth": "Northing",
              style: {
                color: "#fff"
              }
            }}            
            yAxisReversed={true}>

            {this.getSeries().map(({renderType, title, field, data,minValue,maxValue}, idx) => (
              <ChartSeries
                type={renderType}
                key={field}
                id={field}
                title={title}
                data={data}
                minValue={minValue}
                maxValue={maxValue}
                yField={ (this.getGraphType()===1)? "tvd": "northing"}
                dashStyle={"Solid"}
                color={this.getSeriesColor(field)}
                />
            ))}
          </Chart> :
          <LoadingIndicator />}
      </div>
    );
  }

  getSeries() {
    return Object.keys(SUPPORTED_CHART_SERIES)
        .map(field => this.getDataSeries(field));    
  }

  async getData(asset=this.props.asset) {
    let actualData = await api.getAppStorage(METADATA.provider, METADATA.collections[0], asset.get('id'), Map({
      limit: 1
    }));

    actualData = (actualData && actualData.get(0)) ? actualData.get(0).getIn(["data","stations"], List()) : List();

    let planData = await api.getAppStorage(METADATA.provider, METADATA.collections[1], asset.get('id'), Map({
      limit: 1
    }));

    planData = (planData && planData.get(0)) ? planData.get(0).getIn(["data","stations"], List()) : List();

    this.setState({
      actualData: actualData,
      planData: planData
    });

  }

  getDataSeries(field) {
    // let data = [];
    // data = this.props.convert.convertImmutables(data, "tvd", "length", "ft");
    // data = this.props.convert.convertImmutables(data, "vertical_section", "length", "ft");
    
    let seriesProps = {
      renderType: SUPPORTED_CHART_SERIES[field].chartType,
      title: field,
      field,      
      data: (field==="actual")? this.state.actualData: this.state.planData
    };

    if (this.props.autoZoom) {
      const lastActualPoint = this.getLastActualPoint();
      seriesProps = Object.assign({}, seriesProps, {
        minValue: lastActualPoint.get((this.getGraphType()===1)? "tvd": "northing")-1000,
        maxValue: lastActualPoint.get((this.getGraphType()===1)? "tvd": "northing")+1000
      });
    }

    return seriesProps;
  }

  getLastActualPoint() {
    if (!this.state.actualData)
      return;

    return this.state.actualData.get(this.state.actualData.size-1);
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

  getGraphType() {
    return this.props.graphType || 1;
  }
   
}

WellPlanApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default WellPlanApp;

