import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { Icon } from 'react-materialize';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import Convert from '../../../common/Convert';

import './TracesChartColumn.css';

class TracesChartColumn extends Component {

  render() {
    let series = this.getSeries();
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
          {series.map(({field, title, color}) => (
            <ChartSeries
              dashStyle='Solid'
              lineWidth={2}
              key={field}
              id={field}
              title={title}
              data={this.props.data}
              yField={field}
              color={color} />
          ))}
        </Chart>
      </div>
      <div className="c-traces__chart-column__values">
        {series.map(({field, title, color, unit}, idx) => (
          <div className="c-traces__chart-column__values__item" key={idx}>
            <div className="c-traces__chart-column__values__item__meta-row">
              <div className="c-traces__left">&nbsp;</div>
              <div className="c-traces__center"><span>{title}</span></div>
              <div className="c-traces__right" style={{color}}><Icon>network_cell</Icon></div>
            </div>
            <div className="c-traces__chart-column__values__item__meta-row">
              <div className="c-traces__left">&nbsp;</div>
              <div className="c-traces__center">--</div>
              <div className="c-traces__right">&nbsp;</div>
            </div>
            <div className="c-traces__chart-column__values__item__meta-row">
              <div className="c-traces__left">&nbsp;</div>
              <div className="c-traces__center">{unit}</div>
              <div className="c-traces__right">&nbsp;</div>
            </div>
          </div>
        ))}
      </div>
    </div>;
  }

  getSeries() {
    let series = [];

    this.props.traceGraphs.valueSeq().forEach(value => {
      let trace = find(this.props.supportedTraces, {trace: value.get('trace')}) || null;

      if (!trace) {
        return;
      }

      series.push({
        field: trace.trace,
        title: trace.label,
        color: value.get('color'),
        unit: trace.hasOwnProperty("unitType") ? this.props.convert.getUnitDisplay(trace.unitType) : trace.unit,
      });
    });

    return series;
  }
}

TracesChartColumn.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartColumn;
