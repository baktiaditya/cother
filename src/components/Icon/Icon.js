import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { hexPropTypes } from '../../shared/utils';

import actionIcons from './svg/action';
import contentIcons from './svg/content';
import deviceIcons from './svg/device';
import imageIcons from './svg/image';
import fileIcons from './svg/file';
import navigationIcons from './svg/navigation';
import socialIcons from './svg/social';
import placesIcons from './svg/places';
import mapIcons from './svg/maps';
import scss from './Icon.mod.scss';

/**
 * React supports several SVG elements which means you can embed your icon code directly into a
 * component. Inline SVG has good browser support and by using it you can save HTTP requests, icons
 * are still cache-able and you can control them using CSS.
 */
class Icon extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: hexPropTypes,
    icon: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    icon: 'favorite',
  };

  static icons = {
    ...actionIcons,
    ...contentIcons,
    ...deviceIcons,
    ...imageIcons,
    ...navigationIcons,
    ...fileIcons,
    ...socialIcons,
    ...placesIcons,
    ...mapIcons,
  };

  /**
   * Helper method for checking icon availability
   * @param icon
   * @returns {boolean}
   */
  static isExist(icon) {
    return !!Icon.icons[icon];
  }

  render() {
    const {
      className,
      color,
      icon,
      style,
      size,
      ...props
    } = this.props;
    delete props.children;

    const iconStyle = {};
    if (color) {
      iconStyle.color = color;
    }
    if (size) {
      iconStyle.height = size;
      iconStyle.width = size;
    }

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'icon',
    );
    const currIcon = Icon.isExist(icon);

    if (currIcon) {
      return (
        <svg
          {...props}
          className={classes}
          viewBox='0 0 24 24'
          preserveAspectRatio='xMidYMid meet'
          style={{ ...iconStyle, ...style }}
        >
          {Icon.icons[icon]}
        </svg>
      );
    }

    return null;
  }
}

export default Icon;
