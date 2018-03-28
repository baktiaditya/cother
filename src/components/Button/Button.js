import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import _ from 'lodash';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import scss from './Button.mod.scss';

const ICON_PROPS_DEFAULT = {
  icon: undefined,
  position: 'left',
  size: undefined,
};

class Button extends Component {
  static displayName = 'Button';

  static propTypes = {
    active: PropTypes.bool,
    block: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.oneOf(['white']),
    disabled: PropTypes.bool,
    iconProps: PropTypes.shape({
      icon: PropTypes.string,
      size: PropTypes.number,
      position: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
    label: PropTypes.node,
    loaderProps: PropTypes.object,
    onClick: PropTypes.func,
    outline: PropTypes.bool,
    size: PropTypes.oneOf(['default', 'sm', 'lg']),
    style: PropTypes.object,
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    color: 'white',
    iconProps: ICON_PROPS_DEFAULT,
    size: 'default',
    outline: false,
    tag: 'button',
    type: 'button',
  };

  _iconProps = { ...ICON_PROPS_DEFAULT, ...this.props.iconProps };
  _inlineWidth;
  _inlineHeight;

  componentDidMount() {
    // ensure the dom is really mounted
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        const btn = ReactDOM.findDOMNode(this);
        this._inlineWidth = btn.style.width; // get current inline width, if exist
        this._inlineHeight = btn.style.height; // get current inline height, if exist
      });
    }, 0);
  }

  componentWillUpdate(nextProps) {
    // Set the button width and height, if the loader is showing up
    const btn = ReactDOM.findDOMNode(this);

    if (!this.props.isLoading && nextProps.isLoading) {
      const style = window.getComputedStyle(btn, null);
      btn.style.width = !_.isEmpty(this._inlineWidth) ? this._inlineWidth : style.width;
      btn.style.height = !_.isEmpty(this._inlineHeight) ? this._inlineHeight : style.height;
    } else if (this.props.isLoading && !nextProps.isLoading) {
      btn.style.width = !_.isEmpty(this._inlineWidth) ? this._inlineWidth : '';
      btn.style.height = !_.isEmpty(this._inlineHeight) ? this._inlineHeight : '';
    }
  }

  handleClick = (event) => {
    if (this.props.disabled) {
      event.preventDefault();
      return;
    }

    // Un-focus on click
    event.currentTarget.blur();

    this.props.onClick && this.props.onClick(event);
  };

  render() {
    const {
      active, block, children, className, color, disabled,
      isLoading, outline, size, label, width, style,
      ...props
    } = this.props;
    delete props.loaderProps;
    delete props.iconProps;
    delete props.tag;

    const { icon, position: iconPosition, size: iconSize } = this._iconProps;

    let {
      tag: Tag,
    } = this.props;

    if (props.href && Tag === 'button') {
      Tag = 'a';
    }

    if (Tag !== 'button') {
      delete props.type;
    }

    const btnText = label || children;
    const cx = classNames.bind(scss);
    const classes = cx(
      className,
      'btn',
      `btn${outline ? '-outline' : ''}-${color}`,
      {
        [`btn-size-${size}`]: size !== 'default',
        'btn-block': block,
        'btn-has-icon': icon && Icon.isExist(icon),
        'btn-no-text': !btnText,
        'btn-is-loading': isLoading,
        active,
        disabled,
      },
    );

    // Loader color
    let loaderColor;
    if (outline) {
      switch (color) {
        case 'link':
          loaderColor = 'blue';
          break;
        default:
          loaderColor = color;
      }
    } else {
      switch (color) {
        case 'orange':
        case 'blue':
        case 'green':
        case 'red':
          loaderColor = 'white';
          break;
        case 'link':
          loaderColor = 'blue';
          break;
        default:
          loaderColor = 'default';
      }
    }

    const loaderProps = {
      ...this.props.loaderProps,
      className: scss['loader'],
      color: loaderColor,
      size,
    };

    return (
      <Tag
        {...props}
        className={classes}
        onClick={this.handleClick}
        disabled={disabled}
        style={{ ...style, width }}
      >
        {(Icon.isExist(icon) && iconPosition === 'left') &&
        <Icon icon={icon} size={iconSize} className={scss['icon']} />}
        {isLoading
          ? <Loader {...loaderProps} />
          : btnText && <span>{btnText}</span>
        }
        {(Icon.isExist(icon) && iconPosition === 'right') &&
        <Icon icon={icon} size={iconSize} className={scss['icon']} />}
      </Tag>
    );
  }
}

export default Button;
