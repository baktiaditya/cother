import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';
import classNames from 'classnames/bind';
import scss from './ResizeableGrid.mod.scss';

class Cell extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onDimensionChange: PropTypes.func,
    type: PropTypes.oneOf(['row', 'column']),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }

  _ref;
  _resizeSensor;

  componentDidMount() {
    this._resizeSensor = new ResizeSensor(ReactDOM.findDOMNode(this._ref), () => {
      this.props.onDimensionChange && this.props.onDimensionChange();
    });
  }

  componentWillUnmount() {
    this._resizeSensor.detach(ReactDOM.findDOMNode(this._ref));
  }

  render() {
    const {
      className,
      style,
      type,
      height,
      width,
      ...props
    } = this.props;
    delete props.onDimensionChange;

    let combinedStyle = {};
    if (type === 'row') {
      combinedStyle = {
        flex: `0 0 ${width}px`,
        maxWidth: width,
        ...style
      };
    } else {
      combinedStyle = {
        flex: `0 0 ${height}px`,
        maxHeight: height,
        ...style
      };
    }

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'cell',
      `type-${type}`
    );

    return (
      <div
        {...props}
        ref={c => (this._ref = c)}
        className={classes}
        style={combinedStyle}
      />
    );
  }
}

export { Cell };
