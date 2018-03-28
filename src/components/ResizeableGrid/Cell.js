import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ResizeSensor } from 'css-element-queries';
import classNames from 'classnames/bind';
import { isSafari } from '../../shared/utils';
import scss from './ResizeableGrid.mod.scss';

class Cell extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onDimensionChange: PropTypes.func,
    type: PropTypes.oneOf(['row', 'column']),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

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

    const componentStyle = {};
    if (type === 'row') {
      componentStyle.flex = `0 0 ${width}px`;
      componentStyle.maxWidth = width;
    } else {
      componentStyle.flex = `0 0 ${height}px`;
      componentStyle.maxHeight = height;
    }

    if (isSafari) {
      componentStyle.height = '100%';
    }

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'cell',
      `cell-type-${type}`,
    );

    return (
      <div
        {...props}
        ref={c => (this._ref = c)}
        className={classes}
        style={{ ...componentStyle, ...style }}
      />
    );
  }
}

export { Cell };
