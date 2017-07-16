import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';
import classNames from 'classnames/bind';
import scss from './ResizeableGrid.mod.scss';

class Cell extends Component {
  static propTypes = {
    className: PropTypes.string,
    hide: PropTypes.bool,
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
      hide,
      style,
      type,
      height,
      width,
      ...props
    } = this.props;
    delete props.onDimensionChange;

    let combinedStyle = style;
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
      `cell-type-${type}`,
      { 'cell-hide': hide }
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
