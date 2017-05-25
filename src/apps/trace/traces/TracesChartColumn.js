import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import { Icon, Col } from 'react-materialize';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import Convert from '../../../common/Convert';

import './TracesChartColumn.css';

class TracesChartColumn extends Component {

  render() {
    let series = this.getSeries();

    return <Col className={"c-traces__chart-column c-traces__chart-column__"+this.props.totalColumns}>
      <div className={"c-traces__chart-column__chart c-traces__chart-column__chart-" + this.props.traceRowCount}>
        {find(series, {valid: true}) &&
          <Chart
            simpleSeriesData={true}
            chartType="area"
            xField="timestamp"
            size="MEDIUM"
            plotBackgroundColor="#000"
            multiAxis={true}
            marginLeft={0}
            marginRight={0}
            marginTop={0}
            marginBottom={0}
            xAxisGridLineDashStyle="longdash"
            yAxisGridLineDashStyle="longdash"
            xAxisGridLineColor="rgb(40, 40, 40)"
            yAxisGridLineColor="rgb(40, 40, 40)"
            xAxisTickInterval={10000}
            yAxisTickInterval={200}
            widthCols={this.props.widthCols} >
            {series.filter((value, idx) => value.field !== '').map(({field, title, color, type, dashStyle, lineWidth, minValue, maxValue}, idx) => {
              return <ChartSeries
                type={type}
                dashStyle={dashStyle}
                fillOpacity={0.5}
                lineWidth={lineWidth}
                key={field}
                id={field}
                title={title}
                data={this.props.data}
                yAxis={field + "-axis"}
                yField={field}
                color={color}
                minValue={minValue}
                maxValue={maxValue} />;
            })}
          </Chart>}
      </div>
      <div className={"c-traces__chart-column__values c-traces__chart-column__values-" + this.props.traceRowCount}>
        {series.slice(0, this.props.traceRowCount !== undefined ? this.props.traceRowCount : 3).map(({valid, field, title, color, unit, latestValue, minValue, maxValue}, idx) => (
          <div className="c-traces__chart-column__values__item" key={idx} onClick={() => this.props.editTraceGraph(idx + (4 * this.props.columnNumber))}>
            {valid ? <div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-title c-traces__center"><span>{title}</span></div>
                <div className="c-traces__right" style={{color}}><Icon>network_cell</Icon></div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-value c-traces__center">{latestValue}</div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__chart-column__values__item__meta-row-unit c-traces__center">{unit}</div>
                <div className="c-traces__chart-column__values__item__meta-row-scale c-traces__left">{minValue}</div>
                <div className="c-traces__chart-column__values__item__meta-row-scale c-traces__right">{maxValue}</div>
              </div>
            </div> : <div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
              <div className="c-traces__chart-column__values__item__meta-row">
                <div className="c-traces__center"><Icon>add_circle_outline</Icon></div>
              </div>
              <div className="c-traces__chart-column__values__item__meta-row">&nbsp;</div>
            </div>}
          </div>
        ))}
      </div>
    </Col>;
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
          minValue: undefined,
          maxValue: undefined,
          latestValue: '--'
        });
        return;
      }

      // Getting the display unit that will be displayed in the metadata
      let unitType = traceGraph.get('unitType', '');
      let displayUnit;
      if (unitType) {
        displayUnit = this.props.convert.getUnitDisplay(unitType, traceGraph.get('unitTo', null));
      } else if (trace.hasOwnProperty("unitType")) {
        unitType = trace.unitType;
        displayUnit = this.props.convert.getUnitDisplay(trace.unitType);
      } else if (trace.hasOwnProperty('unit')) {
        displayUnit = trace.unit;
      }

      // Converting the unit on the metadata display
      let latestValue = this.props.latestData.getIn(['data', trace.trace], '');
      if (unitType) {
        let unitFrom = traceGraph.get('unitFrom');
        let unitTo = traceGraph.get('unitTo', null);

        if (!unitFrom && trace.hasOwnProperty('cunit')) {
          unitFrom = trace.cunit;
        }

        if (unitFrom) {
          latestValue = this.props.convert.convertValue(latestValue, unitType, unitFrom, unitTo).formatNumeral("0,0.00");
        }
      }

      // Getting the min/max values for auto/static scaling.
      let minValue, maxValue;
      if (!traceGraph.get('autoScale')) {
        minValue = traceGraph.get('minValue');
        maxValue = traceGraph.get('maxValue');
      } else if (trace.hasOwnProperty('min') && trace.hasOwnProperty('max')) {
        minValue = trace.min;
        maxValue = trace.max;
      } else if (traceGraph.get('type') === 'area') {
        // If the graph type is area, and the user didn't set a min/max, we need to manually set a min here.
        // If we don't, it will automatically set the min value at 0 instead of auto-calculating it.
        minValue = (this.props.data.minBy(x => x.get(trace.trace)) || new Map()).get(trace.trace, 0);
        minValue -= minValue / 1000;
      }

      series.push({
        valid: true,
        field: trace.trace,
        title: trace.label,
        color: traceGraph.get('color'),
        unit: displayUnit,
        type: traceGraph.get('type', 'line'), // area or line
        dashStyle: traceGraph.get('dashStyle', 'Solid'), // http://api.highcharts.com/highcharts/plotOptions.line.dashStyle
        lineWidth: traceGraph.get('lineWidth', 2), // 1, 2, or 3
        minValue,
        maxValue,
        latestValue
      });
    });

    return series;
  }
}

TracesChartColumn.propTypes = {
  traceRowCount: PropTypes.number,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  latestData: ImmutablePropTypes.map.isRequired,
  columnNumber: PropTypes.number.isRequired,
  totalColumns: PropTypes.number.isRequired,
  editTraceGraph: PropTypes.func.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartColumn;
