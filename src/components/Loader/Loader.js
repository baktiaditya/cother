import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import scss from './Loader.mod.scss';

class Loader extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOf(['white', 'gray-lighter', 'yellow']),
    size: PropTypes.oneOf(['default', 'sm', 'md', 'lg']),
    type: PropTypes.oneOf(['dotted', 'circular']),
  };

  static defaultProps = {
    color: 'gray-lighter',
    size: 'default',
    type: 'circular',
  };

  render() {
    const {
      className,
      color,
      size,
      type,
      ...props
    } = this.props;
    delete props.children;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      type,
      color ? `${type}-color-${color}` : false,
      size ? `${type}-size-${size}` : false,
    );

    if (type === 'circular') {
      return <div {...props} className={classes} />;
    }

    return (
      <div {...props} className={classes}>
        <div className={scss['dot']} />
        <div className={scss['dot']} />
        <div className={scss['dot']} />
      </div>
    );
  }
}

export default Loader;
