import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import classNames from 'classnames/bind';
import scss from './Grid.mod.scss';

class Column extends Component {
  static propTypes = {
    className: PropTypes.string,
    componentRef: PropTypes.func,
    halign: PropTypes.oneOf(['left', 'right', 'center', 'around', 'between']),
    noGutter: PropTypes.oneOfType([PropTypes.oneOf(['left', 'right']), PropTypes.bool]),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    width: PropTypes.number,
  };

  render() {
    const {
      className,
      halign,
      noGutter,
      size,
      ...props
    } = this.props;
    delete props.style;

    let {
      style,
    } = this.props;

    if (style && style.width) {
      style = {
        flex: `0 0 ${isNumber(style.width) ? style.width : `${style.width}px`}`,
        maxWidth: style.width,
        ...style,
      };
      delete style.width;
    }

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      size ? `col-${size}` : 'col',
      isBoolean(noGutter) && noGutter === true ? 'col-no-gutter' : false,
      {
        [`col-halign-${halign}`]: halign,
        [`col-no-gutter-${noGutter}`]: isString(noGutter),
      },
    );

    return <div {...props} className={classes} style={style} />;
  }
}

export { Column };
