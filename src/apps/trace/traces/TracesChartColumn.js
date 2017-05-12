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

    // Calculating the minimum value in our graph.
    let minValue = undefined;
    let minValues = series.filter(value => value.field !== '').map(({field}) => {
      return (this.props.data.minBy(x => x.get(field)) || new Map()).get(field);
    }).filter(x => typeof x === 'number');

    if (minValues.length !== 0) {
      minValue = Math.min(...minValues);
      minValue -= minValue / 100;
    }

    return <div className="c-traces__chart-column">
      <div className="c-traces__chart-column__chart">
        {find(series, {valid: true}) &&
          <Chart
            chartType="area"
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
            widthCols={this.props.widthCols} >
            {series.filter((value, idx) => value.field !== '').map(({field, title, color, type, dashStyle, lineWidth}, idx) => {
              return <ChartSeries
                minValue={minValue}
                type={type}
                dashStyle={dashStyle}
                fillOpacity={0.5}
                lineWidth={lineWidth}
                key={field}
                id={field}
                title={title}
                data={this.props.data}
                yAxis={idx}
                yField={field}
                color={color} />;
            })}
          </Chart>}
      </div>
      <div className="c-traces__chart-column__values">
        {series.map(({valid, field, title, color, unit}, idx) => (
          <div className="c-traces__chart-column__values__item" key={idx} onClick={() => this.props.editTraceGraph(idx + (3 * this.props.columnNumber))}>
            {valid ? <div>
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
            </div> : <div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__left">&nbsp;</div>
                <div className="c-traces__center"><Icon>add_circle_outline</Icon></div>
                <div className="c-traces__right">&nbsp;</div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
            </div>}
          </div>
        ))}
      </div>
    </div>;
  }

  getSeries() {
    let series = [];

    this.props.traceGraphs.valueSeq().forEach(traceGraph => {
      let trace = find(this.props.supportedTraces, {trace: traceGraph.get('trace')}) || null;

      if (!trace) {
        series.push({
          valid: false,
          field: '',
          title: '',
          color: traceGraph.get('color'),
          unit: '',
          type: 'line',
          dashStyle: 'Solid',
          lineWidth: 2,
        });
        return;
      }

      let unitType = traceGraph.get('unitType', '');
      if (unitType) {
        unitType = this.props.convert.getUnitDisplay(unitType, traceGraph.get('unitTo', null));
      } else if (trace.hasOwnProperty("unitType")) {
        unitType = this.props.convert.getUnitDisplay(trace.unitType);
      } else if (trace.hasOwnProperty('unit')) {
        unitType = trace.unit;
      }

      series.push({
        valid: true,
        field: trace.trace,
        title: trace.label,
        color: traceGraph.get('color'),
        unit: unitType,
        type: traceGraph.get('type', 'line'), // area or line
        dashStyle: traceGraph.get('dashStyle', 'Solid'), // http://api.highcharts.com/highcharts/plotOptions.line.dashStyle
        lineWidth: traceGraph.get('lineWidth', 2), // 1, 2, or 3
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
  columnNumber: PropTypes.number.isRequired,
  editTraceGraph: PropTypes.func.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartColumn;
