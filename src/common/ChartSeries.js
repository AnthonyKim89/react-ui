import {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class ChartSeries extends Component {
}

ChartSeries.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['line', 'scatter']).isRequired,
  data: ImmutablePropTypes.list.isRequired,
  yField: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  title: PropTypes.string,
  color: PropTypes.string
};

export default ChartSeries;