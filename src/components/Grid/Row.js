import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import scss from './Grid.mod.scss';

class Row extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    halign: PropTypes.oneOf(['left', 'right', 'center', 'around', 'between']),
    noGutter: PropTypes.bool,
    valign: PropTypes.oneOf(['baseline', 'top', 'middle', 'bottom']),
  };

  render() {
    const {
      className,
      halign,
      noGutter,
      valign,
      ...props
    } = this.props;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'row',
      {
        'row-no-gutter': noGutter,
        [`row-valign-${valign}`]: valign,
        [`row-halign-${halign}`]: halign,
      },
    );

    return (
      <div {...props} className={classes} data-style='display: flex;' />
    );
  }
}

export { Row };
