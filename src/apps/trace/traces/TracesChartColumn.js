import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS } from 'immutable';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';

import './TracesChartColumn.css';

class TracesChartColumn extends Component {

  render() {
    return <div className="c-traces__chart-column">
      <div className="c-traces__chart-column__chart">
        <Chart
          xField="timestamp"
          size="MEDIUM"
          plotBackgroundColor="#000"
          marginLeft={0}
          marginRight={0}
          marginTop={0}
          marginBottom={0}
          xAxisGridLineDashStyle="longdash"
          yAxisGridLineDashStyle="longdash"
          xAxisGridLineColor="rgb(70, 70, 70)"
          yAxisGridLineColor="rgb(70, 70, 70)"
          xAxisTickInterval={100}
          widthCols={this.props.widthCols}>
          <ChartSeries
            dashStyle='Solid'
            lineWidth={1}
            key={"measured_depth"}
            id={"measured_depth"}
            title={"Depth"}
            data={this.getSeries()}
            yField={"measured_depth"}
            color={"#fff"} />
        </Chart>
      </div>
      <div className="c-traces__chart-column__values">
        Chart Controls / Display
      </div>
    </div>;
  }

  getSeries() {
    let data = [];

    this.props.data.valueSeq().forEach(value => {
      data.push({
        measured_depth: value.getIn(["data", "hole_depth"]),
        timestamp: value.get("timestamp"),
      });
    });

    return fromJS(data);
  }

}

TracesChartColumn.propTypes = {
  data: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartColumn;
