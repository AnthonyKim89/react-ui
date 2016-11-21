import {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class ChartSeries extends Component {
}

ChartSeries.propTypes = {
  type: PropTypes.oneOf(['line', 'scatter']).isRequired,
  data: ImmutablePropTypes.list.isRequired,
  title: PropTypes.string,
  color: PropTypes.string
};

export default ChartSeries;