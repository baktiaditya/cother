import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Button from '../Button/Button';
import * as scss from './ButtonGroup.mod.scss';

class ButtonGroup extends React.Component {
  static displayName = 'ButtonGroup';

  static propTypes = {
    'aria-label': PropTypes.string,
    className: PropTypes.string,
    // Check for children
    children: (props, propName, componentName) => {
      const children = React.Children.toArray(props[propName]);
      const types = [Button];
      const typeNames = [Button.displayName];

      children.forEach((child, index) => {
        if (!isValidElement(child[index]) || types.indexOf(child[index].type) === -1) {
          return new Error(
            `\`${componentName}\` should have child of the following types: \`${typeNames.join('`, ')}\`.`
          );
        }
      });
    },
    role: PropTypes.string,
    size: PropTypes.oneOf(['default', 'xs', 'sm', 'lg']),
    vertical: PropTypes.bool
  };

  static defaultProps = {
    role: 'group'
  };

  render() {
    const {
      children,
      className,
      size,
      vertical,
      ...props
    } = this.props;

    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      vertical ? 'btn-group-vertical' : 'btn-group'
    );

    return (
      <div {...props} className={classes}>
        {
          React.Children.map(children, (child, num) => {
            if (child && child.type === Button) {
              return React.cloneElement(child, {
                className: scss['btn'],
                size,
                key: num
              });
            }
          })
        }
      </div>
    );
  }
}

export default ButtonGroup;
